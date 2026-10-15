package com.example.apiplatform.controller;

import com.example.apiplatform.dto.auth.AuthResponse;
import com.example.apiplatform.dto.auth.LoginRequest;
import com.example.apiplatform.dto.auth.RegisterRequest;
import com.example.apiplatform.dto.auth.UserProfileResponse;
import com.example.apiplatform.dto.common.ApiResponse;
import com.example.apiplatform.security.UserPrincipal;
import com.example.apiplatform.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, and session info")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<UserProfileResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserProfileResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and receive a JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get the current authenticated user's profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileResponse response = authService.getCurrentUserProfile(principal);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
