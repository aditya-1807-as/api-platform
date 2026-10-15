package com.example.apiplatform.entity;

import com.example.apiplatform.enums.QuotaWindow;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "api_usage_counters", uniqueConstraints = {
    @UniqueConstraint(name = "uk_key_window", columnNames = {"api_key_id", "window_type", "window_key"})
}, indexes = {
    @Index(name = "idx_counter_lookup", columnList = "api_key_id, window_type, window_key")
})
public class ApiUsageCounter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "api_key_id", nullable = false)
    private ApiKey apiKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "window_type", nullable = false, length = 10)
    private QuotaWindow windowType;

    @Column(name = "window_key", nullable = false, length = 20)
    private String windowKey;

    @Column(name = "request_count", nullable = false)
    private Long requestCount = 0L;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ApiUsageCounter() {
    }

    public ApiUsageCounter(ApiKey apiKey, QuotaWindow windowType, String windowKey, Long requestCount) {
        this.apiKey = apiKey;
        this.windowType = windowType;
        this.windowKey = windowKey;
        this.requestCount = requestCount != null ? requestCount : 0L;
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = Instant.now();
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

    public QuotaWindow getWindowType() {
        return windowType;
    }

    public void setWindowType(QuotaWindow windowType) {
        this.windowType = windowType;
    }

    public String getWindowKey() {
        return windowKey;
    }

    public void setWindowKey(String windowKey) {
        this.windowKey = windowKey;
    }

    public Long getRequestCount() {
        return requestCount;
    }

    public void setRequestCount(Long requestCount) {
        this.requestCount = requestCount;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ApiUsageCounter that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
