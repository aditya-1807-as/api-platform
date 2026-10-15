package com.example.apiplatform.service;

import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.enums.QuotaWindow;
import com.example.apiplatform.exception.QuotaExceededException;
import com.example.apiplatform.repository.ApiUsageCounterRepository;
import com.example.apiplatform.util.DateUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class QuotaEnforcementService {

    private final ApiUsageCounterRepository counterRepository;

    public QuotaEnforcementService(ApiUsageCounterRepository counterRepository) {
        this.counterRepository = counterRepository;
    }

    /**
     * Atomically validates and increments the request count for both daily and monthly quotas.
     * Uses row-level atomic database updates to ensure concurrency safety.
     * Throws QuotaExceededException (HTTP 429) if either quota is exceeded.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void checkAndIncrementQuota(ApiKey apiKey) {
        Instant now = Instant.now();
        String dayKey = DateUtil.currentDayKey();
        String monthKey = DateUtil.currentMonthKey();

        // 1. Check and increment Daily Quota
        counterRepository.ensureCounterExists(apiKey.getId(), QuotaWindow.DAILY.name(), dayKey, now);
        int dailyUpdated = counterRepository.atomicIncrementIfUnderQuota(
                apiKey.getId(),
                QuotaWindow.DAILY,
                dayKey,
                apiKey.getDailyQuota(),
                now
        );

        if (apiKey.getDailyQuota() != null && dailyUpdated == 0) {
            throw new QuotaExceededException(
                    "Daily quota limit (" + apiKey.getDailyQuota() + " requests) exceeded for this API key"
            );
        }

        // 2. Check and increment Monthly Quota
        counterRepository.ensureCounterExists(apiKey.getId(), QuotaWindow.MONTHLY.name(), monthKey, now);
        int monthlyUpdated = counterRepository.atomicIncrementIfUnderQuota(
                apiKey.getId(),
                QuotaWindow.MONTHLY,
                monthKey,
                apiKey.getMonthlyQuota(),
                now
        );

        if (apiKey.getMonthlyQuota() != null && monthlyUpdated == 0) {
            throw new QuotaExceededException(
                    "Monthly quota limit (" + apiKey.getMonthlyQuota() + " requests) exceeded for this API key"
            );
        }
    }
}
