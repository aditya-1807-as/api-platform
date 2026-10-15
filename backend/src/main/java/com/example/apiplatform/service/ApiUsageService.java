package com.example.apiplatform.service;

import com.example.apiplatform.dto.common.PagedResponse;
import com.example.apiplatform.dto.usage.*;
import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.entity.ApiUsageLog;
import com.example.apiplatform.enums.QuotaWindow;
import com.example.apiplatform.repository.ApiKeyRepository;
import com.example.apiplatform.repository.ApiUsageCounterRepository;
import com.example.apiplatform.repository.ApiUsageLogRepository;
import com.example.apiplatform.util.DateUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ApiUsageService {

    private final ApiUsageLogRepository logRepository;
    private final ApiUsageCounterRepository counterRepository;
    private final ApiKeyRepository apiKeyRepository;

    public ApiUsageService(ApiUsageLogRepository logRepository,
                           ApiUsageCounterRepository counterRepository,
                           ApiKeyRepository apiKeyRepository) {
        this.logRepository = logRepository;
        this.counterRepository = counterRepository;
        this.apiKeyRepository = apiKeyRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordUsage(ApiKey apiKey, String endpoint, String method, int status, long responseTimeMs) {
        ApiUsageLog log = new ApiUsageLog(apiKey, endpoint, method, status, responseTimeMs, Instant.now());
        logRepository.save(log);
    }

    @Transactional(readOnly = true)
    public UsageSummaryResponse getUserSummary(Long userId) {
        Instant startOfToday = Instant.now().truncatedTo(ChronoUnit.DAYS);

        long total = logRepository.countByUserId(userId);
        long today = logRepository.countByUserIdSince(userId, startOfToday);
        long successful = logRepository.countSuccessfulByUserId(userId);
        long failed = logRepository.countFailedByUserId(userId);
        double avgTime = logRepository.avgResponseTimeByUserId(userId);

        // Sum current quotas and limits across user's keys
        List<ApiKey> userKeys = apiKeyRepository.findByUserIdOrderByCreatedAtDesc(userId);
        Long totalDailyLimit = null;
        Long totalMonthlyLimit = null;

        for (ApiKey k : userKeys) {
            if (k.getDailyQuota() != null) {
                totalDailyLimit = (totalDailyLimit == null ? 0L : totalDailyLimit) + k.getDailyQuota();
            }
            if (k.getMonthlyQuota() != null) {
                totalMonthlyLimit = (totalMonthlyLimit == null ? 0L : totalMonthlyLimit) + k.getMonthlyQuota();
            }
        }

        Long dailyUsed = counterRepository.sumByUserAndWindow(userId, QuotaWindow.DAILY, DateUtil.currentDayKey());
        Long monthlyUsed = counterRepository.sumByUserAndWindow(userId, QuotaWindow.MONTHLY, DateUtil.currentMonthKey());

        return new UsageSummaryResponse(
                total,
                today,
                successful,
                failed,
                Math.round(avgTime * 10.0) / 10.0,
                totalDailyLimit,
                dailyUsed != null ? dailyUsed : 0L,
                totalMonthlyLimit,
                monthlyUsed != null ? monthlyUsed : 0L
        );
    }

    @Transactional(readOnly = true)
    public UsageSummaryResponse getGlobalSummary() {
        Instant startOfToday = Instant.now().truncatedTo(ChronoUnit.DAYS);

        long total = logRepository.count();
        long today = logRepository.countGlobalSince(startOfToday);
        long successful = logRepository.countGlobalSuccessful();
        long failed = logRepository.countGlobalFailed();
        double avgTime = logRepository.avgResponseTimeGlobal();

        return new UsageSummaryResponse(
                total,
                today,
                successful,
                failed,
                Math.round(avgTime * 10.0) / 10.0,
                null,
                0L,
                null,
                0L
        );
    }

    @Transactional(readOnly = true)
    public List<DayUsageResponse> getUserDailyUsage(Long userId, int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        List<DayUsageProjection> projections = logRepository.findDailyUsageByUser(userId, since);
        return projections.stream()
                .map(p -> new DayUsageResponse(p.getDay(), p.getCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DayUsageResponse> getGlobalDailyUsage(int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        List<DayUsageProjection> projections = logRepository.findDailyUsageGlobal(since);
        return projections.stream()
                .map(p -> new DayUsageResponse(p.getDay(), p.getCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EndpointUsageResponse> getUserEndpointUsage(Long userId, int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        List<EndpointUsageProjection> projections = logRepository.findEndpointUsageByUser(userId, since);
        return projections.stream()
                .map(p -> new EndpointUsageResponse(p.getEndpoint(), p.getHttpMethod(), p.getCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EndpointUsageResponse> getGlobalEndpointUsage(int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        List<EndpointUsageProjection> projections = logRepository.findEndpointUsageGlobal(since);
        return projections.stream()
                .map(p -> new EndpointUsageResponse(p.getEndpoint(), p.getHttpMethod(), p.getCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public PagedResponse<UsageLogResponse> getUserLogs(Long userId, Long apiKeyId, Pageable pageable) {
        Page<ApiUsageLog> logs;
        if (apiKeyId != null) {
            logs = logRepository.findByApiKeyIdAndUserId(apiKeyId, userId, pageable);
        } else {
            logs = logRepository.findByUserId(userId, pageable);
        }

        List<UsageLogResponse> content = logs.getContent().stream()
                .map(this::toLogResponse)
                .toList();

        return PagedResponse.of(logs, content);
    }

    @Transactional(readOnly = true)
    public PagedResponse<UsageLogResponse> getAllLogsAdmin(Pageable pageable) {
        Page<ApiUsageLog> logs = logRepository.findAllLogs(pageable);
        List<UsageLogResponse> content = logs.getContent().stream()
                .map(this::toLogResponse)
                .toList();
        return PagedResponse.of(logs, content);
    }

    private UsageLogResponse toLogResponse(ApiUsageLog log) {
        return new UsageLogResponse(
                log.getId(),
                log.getApiKey().getId(),
                log.getApiKey().getKeyPrefix(),
                log.getApiKey().getName(),
                log.getEndpoint(),
                log.getHttpMethod(),
                log.getResponseStatus(),
                log.getResponseTimeMs(),
                log.getTimestamp()
        );
    }
}
