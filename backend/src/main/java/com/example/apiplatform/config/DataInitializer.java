package com.example.apiplatform.config;

import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.entity.ApiUsageCounter;
import com.example.apiplatform.entity.ApiUsageLog;
import com.example.apiplatform.entity.User;
import com.example.apiplatform.enums.KeyStatus;
import com.example.apiplatform.enums.QuotaWindow;
import com.example.apiplatform.enums.Role;
import com.example.apiplatform.repository.ApiKeyRepository;
import com.example.apiplatform.repository.ApiUsageCounterRepository;
import com.example.apiplatform.repository.ApiUsageLogRepository;
import com.example.apiplatform.repository.UserRepository;
import com.example.apiplatform.util.ApiKeyGenerator;
import com.example.apiplatform.util.DateUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final ApiUsageLogRepository logRepository;
    private final ApiUsageCounterRepository counterRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ApiKeyRepository apiKeyRepository,
                           ApiUsageLogRepository logRepository,
                           ApiUsageCounterRepository counterRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.apiKeyRepository = apiKeyRepository;
        this.logRepository = logRepository;
        this.counterRepository = counterRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking database mock users and seed data...");

        // 1. Seed or ensure admin and mock users
        String defaultPasswordHash = passwordEncoder.encode("Password123!");

        User adminUser = getOrCreateUser("admin@example.com", "System Administrator", Role.ROLE_ADMIN, defaultPasswordHash);
        User adityaUser = getOrCreateUser("aditya.asthana@enterprise.ai", "Aditya Asthana (Lead Architect)", Role.ROLE_ADMIN, defaultPasswordHash);
        User sarahUser = getOrCreateUser("sarah.chen@anthropic-partner.io", "Sarah Chen (Senior MLOps)", Role.ROLE_USER, defaultPasswordHash);
        User alexUser = getOrCreateUser("alex.kumar@fintechscale.com", "Alex Kumar (Backend Tech Lead)", Role.ROLE_USER, defaultPasswordHash);
        User elenaUser = getOrCreateUser("elena.rostova@cloudnative.dev", "Elena Rostova (DevOps & Security)", Role.ROLE_USER, defaultPasswordHash);
        User marcusUser = getOrCreateUser("marcus.vance@datascience.corp", "Marcus Vance (Principal AI Scientist)", Role.ROLE_USER, defaultPasswordHash);

        // 2. Ensure active API keys for all users
        ApiKey adminKey1 = getOrCreateApiKey(adminUser, "Core Production Gateway", 50000, 1000000);
        ApiKey adminKey2 = getOrCreateApiKey(adminUser, "Claude 3.5 Sonnet Runner", 20000, 500000);
        ApiKey adityaKey = getOrCreateApiKey(adityaUser, "High-Throughput DeepSeek Bot", 25000, 500000);
        ApiKey sarahKey = getOrCreateApiKey(sarahUser, "Anthropic Partner Pipeline", 15000, 300000);
        ApiKey alexKey = getOrCreateApiKey(alexUser, "FinTech Fraud Detection Gateway", 10000, 200000);
        ApiKey elenaKey = getOrCreateApiKey(elenaUser, "Kubernetes Telemetry Ingest", 12000, 250000);
        ApiKey marcusKey = getOrCreateApiKey(marcusUser, "GPT-4o Research Benchmarks", 18000, 350000);

        List<ApiKey> allKeys = List.of(adminKey1, adminKey2, adityaKey, sarahKey, alexKey, elenaKey, marcusKey);

        // 3. Check if usage logs need seeding
        long logCount = logRepository.count();
        if (logCount < 100) {
            log.info("Seeding realistic multi-day API usage telemetry logs and quota counters...");
            seedUsageLogs(allKeys);
        }

        // 4. Ensure current daily and monthly counters for active keys
        seedCountersIfMissing(adminKey1, 284L, 7420L);
        seedCountersIfMissing(adminKey2, 115L, 3180L);
        seedCountersIfMissing(adityaKey, 412L, 9540L);
        seedCountersIfMissing(sarahKey, 95L, 2600L);
        seedCountersIfMissing(alexKey, 180L, 4890L);

        log.info("Database mock users and telemetry initialization complete. Users in system: {}", userRepository.count());
    }

    private User getOrCreateUser(String email, String fullName, Role role, String passwordHash) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User(email, passwordHash, fullName, role);
            User saved = userRepository.save(newUser);
            log.info("Seeded mock user: {} ({}) with role {}", fullName, email, role);
            return saved;
        });
    }

    private ApiKey getOrCreateApiKey(User user, String keyName, int dailyQuota, int monthlyQuota) {
        List<ApiKey> existing = apiKeyRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (ApiKey k : existing) {
            if (k.getName().equalsIgnoreCase(keyName)) {
                return k;
            }
        }

        ApiKeyGenerator.GeneratedKey generated = ApiKeyGenerator.generate();
        ApiKey apiKey = new ApiKey(
                user,
                keyName,
                generated.prefix(),
                generated.hash(),
                KeyStatus.ACTIVE,
                dailyQuota,
                monthlyQuota,
                Instant.now().plus(365, ChronoUnit.DAYS)
        );
        ApiKey saved = apiKeyRepository.save(apiKey);
        log.info("Seeded API key: '{}' ({}) for user {}", keyName, saved.getKeyPrefix(), user.getEmail());
        return saved;
    }

    private void seedUsageLogs(List<ApiKey> keys) {
        Random random = new Random(42);
        List<ApiUsageLog> logsToBatch = new ArrayList<>();

        String[] endpoints = {
                "/api/v1/chat/completions",
                "/api/v1/chat/completions",
                "/api/v1/chat/completions",
                "/api/v1/models",
                "/api/v1/models",
                "/api/v1/keys",
                "/api/v1/tester/public",
                "/api/v1/tester/protected"
        };

        Instant now = Instant.now();

        // Seed logs spanning the past 14 days
        for (int dayOffset = 13; dayOffset >= 0; dayOffset--) {
            int requestsThisDay = 25 + random.nextInt(35); // 25 to 60 requests per day

            for (int r = 0; r < requestsThisDay; r++) {
                ApiKey key = keys.get(random.nextInt(keys.size()));
                String endpoint = endpoints[random.nextInt(endpoints.length)];
                String method = endpoint.contains("chat") ? "POST" : (endpoint.contains("keys") && random.nextBoolean() ? "POST" : "GET");

                // Realistic status code distribution: 95% 200/201, 3% 429, 1.5% 400, 0.5% 500
                int roll = random.nextInt(100);
                int status;
                if (roll < 93) {
                    status = 200;
                } else if (roll < 95) {
                    status = 201;
                } else if (roll < 98) {
                    status = 429; // Rate limit trigger
                } else if (roll < 99) {
                    status = 400; // Bad request
                } else {
                    status = 500; // Internal error
                }

                // Response time in milliseconds
                long latency;
                if (endpoint.contains("chat")) {
                    latency = 120 + random.nextInt(340); // 120ms - 460ms for LLM completions
                } else {
                    latency = 8 + random.nextInt(35); // 8ms - 43ms for lightweight endpoints
                }

                int secondOffset = random.nextInt(86400);
                Instant timestamp = now.minus(dayOffset, ChronoUnit.DAYS).minus(secondOffset, ChronoUnit.SECONDS);

                logsToBatch.add(new ApiUsageLog(key, endpoint, method, status, latency, timestamp));
            }
        }

        logRepository.saveAll(logsToBatch);
        log.info("Successfully seeded {} realistic usage telemetry logs across 14 days", logsToBatch.size());
    }

    private void seedCountersIfMissing(ApiKey key, Long dailyCount, Long monthlyCount) {
        String dayKey = DateUtil.currentDayKey();
        String monthKey = DateUtil.currentMonthKey();

        if (counterRepository.findByApiKeyIdAndWindowTypeAndWindowKey(key.getId(), QuotaWindow.DAILY, dayKey).isEmpty()) {
            counterRepository.save(new ApiUsageCounter(key, QuotaWindow.DAILY, dayKey, dailyCount));
        }

        if (counterRepository.findByApiKeyIdAndWindowTypeAndWindowKey(key.getId(), QuotaWindow.MONTHLY, monthKey).isEmpty()) {
            counterRepository.save(new ApiUsageCounter(key, QuotaWindow.MONTHLY, monthKey, monthlyCount));
        }
    }
}
