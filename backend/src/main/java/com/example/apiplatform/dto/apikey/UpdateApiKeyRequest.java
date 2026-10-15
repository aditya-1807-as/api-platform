package com.example.apiplatform.dto.apikey;

import com.example.apiplatform.enums.KeyStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class UpdateApiKeyRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    private KeyStatus status;

    @Min(value = 1, message = "Daily quota must be at least 1")
    private Integer dailyQuota;

    @Min(value = 1, message = "Monthly quota must be at least 1")
    private Integer monthlyQuota;

    public UpdateApiKeyRequest() {
    }

    public UpdateApiKeyRequest(String name, KeyStatus status, Integer dailyQuota, Integer monthlyQuota) {
        this.name = name;
        this.status = status;
        this.dailyQuota = dailyQuota;
        this.monthlyQuota = monthlyQuota;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}
