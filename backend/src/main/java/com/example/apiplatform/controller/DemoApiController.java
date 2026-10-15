package com.example.apiplatform.controller;

import com.example.apiplatform.dto.common.ApiResponse;
import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.security.ApiKeyAuthenticationFilter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/demo")
@Tag(name = "Protected Demo APIs", description = "Sample APIs protected by X-API-Key header authentication")
public class DemoApiController {

    @GetMapping("/profile")
    @Operation(summary = "Get client key info via X-API-Key header", parameters = {
            @Parameter(name = "X-API-Key", in = ParameterIn.HEADER, required = true, description = "Client API Key")
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(HttpServletRequest request) {
        ApiKey apiKey = (ApiKey) request.getAttribute(ApiKeyAuthenticationFilter.CURRENT_API_KEY_ATTR);

        Map<String, Object> data = new HashMap<>();
        data.put("apiKeyId", apiKey.getId());
        data.put("keyName", apiKey.getName());
        data.put("prefix", apiKey.getKeyPrefix());
        data.put("dailyQuota", apiKey.getDailyQuota());
        data.put("monthlyQuota", apiKey.getMonthlyQuota());
        data.put("timestamp", Instant.now().toString());
        data.put("message", "Authentication succeeded via valid X-API-Key header!");

        return ResponseEntity.ok(ApiResponse.success("Demo Profile retrieved successfully", data));
    }

    @GetMapping("/data")
    @Operation(summary = "Fetch sample dataset via X-API-Key header", parameters = {
            @Parameter(name = "X-API-Key", in = ParameterIn.HEADER, required = true, description = "Client API Key")
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> getData() {
        Map<String, Object> data = new HashMap<>();
        data.put("items", List.of(
                Map.of("id", "item-101", "name", "Cloud Compute Node A", "status", "RUNNING"),
                Map.of("id", "item-102", "name", "Storage Bucket Primary", "status", "ACTIVE"),
                Map.of("id", "item-103", "name", "Edge Delivery CDN", "status", "OPTIMAL")
        ));
        data.put("recordCount", 3);
        data.put("generatedAt", Instant.now().toString());

        return ResponseEntity.ok(ApiResponse.success("Sample data fetched successfully", data));
    }

    @PostMapping("/echo")
    @Operation(summary = "Echo back payload and request metadata via X-API-Key header", parameters = {
            @Parameter(name = "X-API-Key", in = ParameterIn.HEADER, required = true, description = "Client API Key")
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> echo(
            HttpServletRequest request,
            @RequestBody(required = false) Map<String, Object> payload) {
        ApiKey apiKey = (ApiKey) request.getAttribute(ApiKeyAuthenticationFilter.CURRENT_API_KEY_ATTR);

        Map<String, Object> response = new HashMap<>();
        response.put("echo", payload != null ? payload : Map.of());
        response.put("clientKeyPrefix", apiKey.getKeyPrefix());
        response.put("processedAt", Instant.now().toString());

        return ResponseEntity.ok(ApiResponse.success("Payload echoed successfully", response));
    }
}
