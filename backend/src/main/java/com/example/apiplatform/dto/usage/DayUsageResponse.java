package com.example.apiplatform.dto.usage;

public class DayUsageResponse {

    private String day;
    private Long count;

    public DayUsageResponse() {
    }

    public DayUsageResponse(String day, Long count) {
        this.day = day;
        this.count = count;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
