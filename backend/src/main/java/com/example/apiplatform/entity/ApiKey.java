package com.example.apiplatform.entity;

import com.example.apiplatform.enums.KeyStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "api_keys", indexes = {
    @Index(name = "idx_api_keys_user_id", columnList = "user_id"),
    @Index(name = "idx_api_keys_prefix", columnList = "key_prefix"),
    @Index(name = "idx_api_keys_hash", columnList = "key_hash", unique = true)
})
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "key_prefix", nullable = false, length = 20)
    private String keyPrefix;

    @Column(name = "key_hash", nullable = false, unique = true, length = 64)
    private String keyHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private KeyStatus status;

    @Column(name = "daily_quota")
    private Integer dailyQuota;

    @Column(name = "monthly_quota")
    private Integer monthlyQuota;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ApiKey() {
    }

    public ApiKey(User user, String name, String keyPrefix, String keyHash, KeyStatus status,
                  Integer dailyQuota, Integer monthlyQuota, Instant expiresAt) {
        this.user = user;
        this.name = name;
        this.keyPrefix = keyPrefix;
        this.keyHash = keyHash;
        this.status = status;
        this.dailyQuota = dailyQuota;
        this.monthlyQuota = monthlyQuota;
        this.expiresAt = expiresAt;
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) {
            this.status = KeyStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public boolean isExpired() {
        return expiresAt != null && Instant.now().isAfter(expiresAt);
    }

    public boolean isUsable() {
        return status == KeyStatus.ACTIVE && !isExpired();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKeyPrefix() {
        return keyPrefix;
    }

    public void setKeyPrefix(String keyPrefix) {
        this.keyPrefix = keyPrefix;
    }

    public String getKeyHash() {
        return keyHash;
    }

    public void setKeyHash(String keyHash) {
        this.keyHash = keyHash;
    }

    public KeyStatus getStatus() {
        return status;
    }

    public void setStatus(KeyStatus status) {
        this.status = status;
    }

    public Integer getDailyQuota() {
        return dailyQuota;
    }

    public void setDailyQuota(Integer dailyQuota) {
        this.dailyQuota = dailyQuota;
    }

    public Integer getMonthlyQuota() {
        return monthlyQuota;
    }

    public void setMonthlyQuota(Integer monthlyQuota) {
        this.monthlyQuota = monthlyQuota;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
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
        if (!(o instanceof ApiKey apiKey)) return false;
        return Objects.equals(id, apiKey.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
