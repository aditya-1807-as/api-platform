package com.example.apiplatform.dto.apikey;

import com.example.apiplatform.enums.KeyStatus;
import java.time.Instant;

public class ApiKeyCreatedResponse {

    private Long id;
    private String name;
    private String rawSecretKey;
    private String keyPrefix;
    private KeyStatus status;
    private Integer dailyQuota;
    private Integer monthlyQuota;
    private Instant expiresAt;
    private Instant createdAt;
    private String warning = "Make sure to copy your API key now. You will not be able to see it again!";

    public ApiKeyCreatedResponse() {
    }

    public ApiKeyCreatedResponse(Long id, String name, String rawSecretKey, String keyPrefix,
                                 KeyStatus status, Integer dailyQuota, Integer monthlyQuota,
                                 Instant expiresAt, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.rawSecretKey = rawSecretKey;
        this.keyPrefix = keyPrefix;
        this.status = status;
        this.dailyQuota = dailyQuota;
        this.monthlyQuota = monthlyQuota;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
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

    public String getRawSecretKey() {
        return rawSecretKey;
    }

    public void setRawSecretKey(String rawSecretKey) {
        this.rawSecretKey = rawSecretKey;
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

    public String getWarning() {
        return warning;
    }

    public void setWarning(String warning) {
        this.warning = warning;
    }
}
