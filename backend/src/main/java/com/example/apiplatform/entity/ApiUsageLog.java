package com.example.apiplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "api_usage_logs", indexes = {
    @Index(name = "idx_usage_key_ts", columnList = "api_key_id, timestamp"),
    @Index(name = "idx_usage_ts_status", columnList = "timestamp, response_status"),
    @Index(name = "idx_usage_endpoint", columnList = "endpoint")
})
public class ApiUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "api_key_id", nullable = false)
    private ApiKey apiKey;

    @Column(nullable = false, length = 255)
    private String endpoint;

    @Column(name = "http_method", nullable = false, length = 10)
    private String httpMethod;

    @Column(name = "response_status", nullable = false)
    private Integer responseStatus;

    @Column(name = "response_time_ms", nullable = false)
    private Long responseTimeMs;

    @Column(nullable = false)
    private Instant timestamp;

    public ApiUsageLog() {
    }

    public ApiUsageLog(ApiKey apiKey, String endpoint, String httpMethod,
                       Integer responseStatus, Long responseTimeMs, Instant timestamp) {
        this.apiKey = apiKey;
        this.endpoint = endpoint;
        this.httpMethod = httpMethod;
        this.responseStatus = responseStatus;
        this.responseTimeMs = responseTimeMs;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ApiKey getApiKey() {
        return apiKey;
    }

    public void setApiKey(ApiKey apiKey) {
        this.apiKey = apiKey;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ApiUsageLog that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
