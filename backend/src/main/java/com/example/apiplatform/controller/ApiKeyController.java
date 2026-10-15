package com.example.apiplatform.controller;

import com.example.apiplatform.dto.apikey.ApiKeyCreatedResponse;
import com.example.apiplatform.dto.apikey.ApiKeyResponse;
import com.example.apiplatform.dto.apikey.CreateApiKeyRequest;
import com.example.apiplatform.dto.apikey.UpdateApiKeyRequest;
import com.example.apiplatform.dto.common.ApiResponse;
import com.example.apiplatform.security.UserPrincipal;
import com.example.apiplatform.service.ApiKeyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/keys")
@Tag(name = "API Key Management", description = "Endpoints for creating, viewing, updating, and revoking API keys")
@SecurityRequirement(name = "BearerAuth")
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    public ApiKeyController(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @PostMapping
    @Operation(summary = "Generate a new API key (Full secret key is returned only once)")
    public ResponseEntity<ApiResponse<ApiKeyCreatedResponse>> createKey(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateApiKeyRequest request) {
        ApiKeyCreatedResponse response = apiKeyService.createApiKey(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("API Key generated successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List all API keys owned by current user (Does not expose secret key)")
    public ResponseEntity<ApiResponse<List<ApiKeyResponse>>> listKeys(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ApiKeyResponse> response = apiKeyService.getKeysByUserId(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get metadata of a specific API key")
    public ResponseEntity<ApiResponse<ApiKeyResponse>> getKey(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ApiKeyResponse response = apiKeyService.getKeyById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update an API key name, status, or quota limits")
    public ResponseEntity<ApiResponse<ApiKeyResponse>> updateKey(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateApiKeyRequest request) {
        ApiKeyResponse response = apiKeyService.updateKey(id, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("API Key updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Revoke an API key immediately")
    public ResponseEntity<ApiResponse<Void>> revokeKey(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        apiKeyService.revokeKey(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("API Key revoked successfully", null));
    }
}
