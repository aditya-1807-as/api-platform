package com.example.apiplatform.dto.usage;

public class UsageSummaryResponse {

    private long totalRequests;
    private long requestsToday;
    private long successfulRequests;
    private long failedRequests;
    private double avgResponseTimeMs;
    private Long dailyQuotaLimit;
    private long dailyQuotaUsed;
    private Long monthlyQuotaLimit;
    private long monthlyQuotaUsed;

    public UsageSummaryResponse() {
    }

    public UsageSummaryResponse(long totalRequests, long requestsToday, long successfulRequests,
                                long failedRequests, double avgResponseTimeMs, Long dailyQuotaLimit,
                                long dailyQuotaUsed, Long monthlyQuotaLimit, long monthlyQuotaUsed) {
        this.totalRequests = totalRequests;
        this.requestsToday = requestsToday;
        this.successfulRequests = successfulRequests;
        this.failedRequests = failedRequests;
        this.avgResponseTimeMs = avgResponseTimeMs;
        this.dailyQuotaLimit = dailyQuotaLimit;
        this.dailyQuotaUsed = dailyQuotaUsed;
        this.monthlyQuotaLimit = monthlyQuotaLimit;
        this.monthlyQuotaUsed = monthlyQuotaUsed;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getRequestsToday() {
        return requestsToday;
    }

    public void setRequestsToday(long requestsToday) {
        this.requestsToday = requestsToday;
    }

    public long getSuccessfulRequests() {
        return successfulRequests;
    }

    public void setSuccessfulRequests(long successfulRequests) {
        this.successfulRequests = successfulRequests;
    }

    public long getFailedRequests() {
        return failedRequests;
    }

    public void setFailedRequests(long failedRequests) {
        this.failedRequests = failedRequests;
    }

    public double getAvgResponseTimeMs() {
        return avgResponseTimeMs;
    }

    public void setAvgResponseTimeMs(double avgResponseTimeMs) {
        this.avgResponseTimeMs = avgResponseTimeMs;
    }

    public Long getDailyQuotaLimit() {
        return dailyQuotaLimit;
    }

    public void setDailyQuotaLimit(Long dailyQuotaLimit) {
        this.dailyQuotaLimit = dailyQuotaLimit;
    }

    public long getDailyQuotaUsed() {
        return dailyQuotaUsed;
    }

    public void setDailyQuotaUsed(long dailyQuotaUsed) {
        this.dailyQuotaUsed = dailyQuotaUsed;
    }

    public Long getMonthlyQuotaLimit() {
        return monthlyQuotaLimit;
    }

    public void setMonthlyQuotaLimit(Long monthlyQuotaLimit) {
        this.monthlyQuotaLimit = monthlyQuotaLimit;
    }

    public long getMonthlyQuotaUsed() {
        return monthlyQuotaUsed;
    }

    public void setMonthlyQuotaUsed(long monthlyQuotaUsed) {
        this.monthlyQuotaUsed = monthlyQuotaUsed;
    }
}
