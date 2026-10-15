package com.example.apiplatform.dto.apikey;

import com.example.apiplatform.enums.KeyStatus;
import java.time.Instant;

public class ApiKeyResponse {

    private Long id;
    private String name;
    private String keyPrefix;
    private KeyStatus status;
    private Integer dailyQuota;
    private Integer monthlyQuota;
    private Instant expiresAt;
    private Instant createdAt;
    private Instant updatedAt;
    private Long ownerId;
    private String ownerEmail;

    public ApiKeyResponse() {
    }

    public ApiKeyResponse(Long id, String name, String keyPrefix, KeyStatus status,
                          Integer dailyQuota, Integer monthlyQuota, Instant expiresAt,
                          Instant createdAt, Instant updatedAt, Long ownerId, String ownerEmail) {
        this.id = id;
        this.name = name;
        this.keyPrefix = keyPrefix;
        this.status = status;
        this.dailyQuota = dailyQuota;
        this.monthlyQuota = monthlyQuota;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.ownerId = ownerId;
        this.ownerEmail = ownerEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }
}
