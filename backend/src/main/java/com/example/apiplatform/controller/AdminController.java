package com.example.apiplatform.controller;

import com.example.apiplatform.dto.apikey.ApiKeyResponse;
import com.example.apiplatform.dto.auth.UserProfileResponse;
import com.example.apiplatform.dto.common.ApiResponse;
import com.example.apiplatform.dto.common.PagedResponse;
import com.example.apiplatform.dto.usage.DayUsageResponse;
import com.example.apiplatform.dto.usage.EndpointUsageResponse;
import com.example.apiplatform.dto.usage.UsageLogResponse;
import com.example.apiplatform.dto.usage.UsageSummaryResponse;
import com.example.apiplatform.entity.User;
import com.example.apiplatform.repository.UserRepository;
import com.example.apiplatform.service.ApiKeyService;
import com.example.apiplatform.service.ApiUsageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Management", description = "Privileged endpoints restricted to administrators (ROLE_ADMIN)")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ApiKeyService apiKeyService;
    private final ApiUsageService apiUsageService;

    public AdminController(UserRepository userRepository,
                           ApiKeyService apiKeyService,
                           ApiUsageService apiUsageService) {
        this.userRepository = userRepository;
        this.apiKeyService = apiKeyService;
        this.apiUsageService = apiUsageService;
    }

    @GetMapping("/users")
    @Operation(summary = "Get paginated list of all registered platform users")
    public ResponseEntity<ApiResponse<PagedResponse<UserProfileResponse>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending());
        Page<User> users = userRepository.findAll(pageable);
        List<UserProfileResponse> dtos = users.getContent().stream()
                .map(u -> new UserProfileResponse(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.getCreatedAt()))
                .toList();

        return ResponseEntity.ok(ApiResponse.success(PagedResponse.of(users, dtos)));
    }

    @GetMapping("/keys")
    @Operation(summary = "Get paginated list of all system API keys across users")
    public ResponseEntity<ApiResponse<PagedResponse<ApiKeyResponse>>> getKeys(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending());
        Page<ApiKeyResponse> response = apiKeyService.getAllKeysAdmin(pageable);
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.of(response, response.getContent())));
    }

    @GetMapping("/usage/summary")
    @Operation(summary = "Get global system-wide usage statistics")
    public ResponseEntity<ApiResponse<UsageSummaryResponse>> getGlobalSummary() {
        UsageSummaryResponse response = apiUsageService.getGlobalSummary();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/usage/by-day")
    @Operation(summary = "Get global daily request volume (last N days)")
    public ResponseEntity<ApiResponse<List<DayUsageResponse>>> getGlobalDailyUsage(
            @RequestParam(defaultValue = "30") int days) {
        List<DayUsageResponse> response = apiUsageService.getGlobalDailyUsage(days);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/usage/by-endpoint")
    @Operation(summary = "Get global request volume breakdown by endpoint")
    public ResponseEntity<ApiResponse<List<EndpointUsageResponse>>> getGlobalEndpointUsage(
            @RequestParam(defaultValue = "30") int days) {
        List<EndpointUsageResponse> response = apiUsageService.getGlobalEndpointUsage(days);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/usage/history")
    @Operation(summary = "Get global paginated request history across all keys and users")
    public ResponseEntity<ApiResponse<PagedResponse<UsageLogResponse>>> getGlobalHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("timestamp").descending());
        PagedResponse<UsageLogResponse> response = apiUsageService.getAllLogsAdmin(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
