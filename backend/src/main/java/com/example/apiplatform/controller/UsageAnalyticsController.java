package com.example.apiplatform.controller;

import com.example.apiplatform.dto.common.ApiResponse;
import com.example.apiplatform.dto.common.PagedResponse;
import com.example.apiplatform.dto.usage.DayUsageResponse;
import com.example.apiplatform.dto.usage.EndpointUsageResponse;
import com.example.apiplatform.dto.usage.UsageLogResponse;
import com.example.apiplatform.dto.usage.UsageSummaryResponse;
import com.example.apiplatform.security.UserPrincipal;
import com.example.apiplatform.service.ApiUsageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usage")
@Tag(name = "Usage Analytics", description = "Endpoints for usage metrics, request logs, and aggregated analytics")
@SecurityRequirement(name = "BearerAuth")
public class UsageAnalyticsController {

    private final ApiUsageService apiUsageService;

    public UsageAnalyticsController(ApiUsageService apiUsageService) {
        this.apiUsageService = apiUsageService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get high-level usage summary and quota status for the current user")
    public ResponseEntity<ApiResponse<UsageSummaryResponse>> getSummary(
            @AuthenticationPrincipal UserPrincipal principal) {
        UsageSummaryResponse response = apiUsageService.getUserSummary(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/by-day")
    @Operation(summary = "Get request volume grouped by day (last N days)")
    public ResponseEntity<ApiResponse<List<DayUsageResponse>>> getDailyUsage(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "30") int days) {
        List<DayUsageResponse> response = apiUsageService.getUserDailyUsage(principal.getId(), days);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/by-endpoint")
    @Operation(summary = "Get request volume breakdown by endpoint")
    public ResponseEntity<ApiResponse<List<EndpointUsageResponse>>> getEndpointUsage(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "30") int days) {
        List<EndpointUsageResponse> response = apiUsageService.getUserEndpointUsage(principal.getId(), days);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/history")
    @Operation(summary = "Get paginated recent API request logs")
    public ResponseEntity<ApiResponse<PagedResponse<UsageLogResponse>>> getHistory(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long apiKeyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        // Enforce maximum page size to prevent abuse
        int boundedSize = Math.min(Math.max(size, 1), 100);
        Pageable pageable = PageRequest.of(page, boundedSize, Sort.by("timestamp").descending());
        PagedResponse<UsageLogResponse> response = apiUsageService.getUserLogs(principal.getId(), apiKeyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
