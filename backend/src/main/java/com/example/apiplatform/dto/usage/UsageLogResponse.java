package com.example.apiplatform.dto.usage;

import java.time.Instant;

public class UsageLogResponse {

    private Long id;
    private Long apiKeyId;
    private String apiKeyPrefix;
    private String apiKeyName;
    private String endpoint;
    private String httpMethod;
    private Integer responseStatus;
    private Long responseTimeMs;
    private Instant timestamp;

    public UsageLogResponse() {
    }

    public UsageLogResponse(Long id, Long apiKeyId, String apiKeyPrefix, String apiKeyName,
                            String endpoint, String httpMethod, Integer responseStatus,
                            Long responseTimeMs, Instant timestamp) {
        this.id = id;
        this.apiKeyId = apiKeyId;
        this.apiKeyPrefix = apiKeyPrefix;
        this.apiKeyName = apiKeyName;
        this.endpoint = endpoint;
        this.httpMethod = httpMethod;
        this.responseStatus = responseStatus;
        this.responseTimeMs = responseTimeMs;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getApiKeyId() {
        return apiKeyId;
    }

    public void setApiKeyId(Long apiKeyId) {
        this.apiKeyId = apiKeyId;
    }

    public String getApiKeyPrefix() {
        return apiKeyPrefix;
    }

    public void setApiKeyPrefix(String apiKeyPrefix) {
        this.apiKeyPrefix = apiKeyPrefix;
    }

    public String getApiKeyName() {
        return apiKeyName;
    }

    public void setApiKeyName(String apiKeyName) {
        this.apiKeyName = apiKeyName;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getHttpMethod() {
        return httpMethod;
    }

    public void setHttpMethod(String httpMethod) {
        this.httpMethod = httpMethod;
    }

    public Integer getResponseStatus() {
        return responseStatus;
    }

    public void setResponseStatus(Integer responseStatus) {
        this.responseStatus = responseStatus;
    }

    public Long getResponseTimeMs() {
        return responseTimeMs;
    }

    public void setResponseTimeMs(Long responseTimeMs) {
        this.responseTimeMs = responseTimeMs;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
