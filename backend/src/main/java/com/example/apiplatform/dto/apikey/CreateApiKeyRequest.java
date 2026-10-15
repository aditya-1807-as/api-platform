package com.example.apiplatform.dto.apikey;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateApiKeyRequest {

    @NotBlank(message = "API key name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Min(value = 1, message = "Daily quota must be at least 1")
    private Integer dailyQuota;

    @Min(value = 1, message = "Monthly quota must be at least 1")
    private Integer monthlyQuota;

    @Min(value = 1, message = "Expiration in days must be at least 1")
    private Integer expiresInDays;

    public CreateApiKeyRequest() {
    }

    public CreateApiKeyRequest(String name, Integer dailyQuota, Integer monthlyQuota, Integer expiresInDays) {
        this.name = name;
        this.dailyQuota = dailyQuota;
        this.monthlyQuota = monthlyQuota;
        this.expiresInDays = expiresInDays;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Integer getExpiresInDays() {
        return expiresInDays;
    }

    public void setExpiresInDays(Integer expiresInDays) {
        this.expiresInDays = expiresInDays;
    }
}
