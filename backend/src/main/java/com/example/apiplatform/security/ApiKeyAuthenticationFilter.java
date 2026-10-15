package com.example.apiplatform.security;

import com.example.apiplatform.dto.common.ErrorResponse;
import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.enums.KeyStatus;
import com.example.apiplatform.exception.QuotaExceededException;
import com.example.apiplatform.repository.ApiKeyRepository;
import com.example.apiplatform.service.ApiUsageService;
import com.example.apiplatform.service.QuotaEnforcementService;
import com.example.apiplatform.util.ApiKeyGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    public static final String API_KEY_HEADER = "X-API-Key";
    public static final String CURRENT_API_KEY_ATTR = "CURRENT_API_KEY";

    private final ApiKeyRepository apiKeyRepository;
    private final QuotaEnforcementService quotaEnforcementService;
    private final ApiUsageService apiUsageService;
    private final ObjectMapper objectMapper;

    public ApiKeyAuthenticationFilter(ApiKeyRepository apiKeyRepository,
                                      QuotaEnforcementService quotaEnforcementService,
                                      ApiUsageService apiUsageService,
                                      ObjectMapper objectMapper) {
        this.apiKeyRepository = apiKeyRepository;
        this.quotaEnforcementService = quotaEnforcementService;
        this.apiUsageService = apiUsageService;
        this.objectMapper = objectMapper.findAndRegisterModules();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Protect demo endpoints and OpenAI/OpenRouter chat completions endpoint
        boolean isProtected = path.startsWith("/api/v1/demo") || path.startsWith("/api/v1/chat/completions");
        return !isProtected;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        long startTime = System.currentTimeMillis();
        String apiKeyHeader = request.getHeader(API_KEY_HEADER);

        // Also support OpenAI standard: Authorization: Bearer ak_live_...
        if (!StringUtils.hasText(apiKeyHeader)) {
            String authHeader = request.getHeader("Authorization");
            if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ak_live_")) {
                apiKeyHeader = authHeader.substring(7).trim();
            }
        }

        // 1. Missing Header check
        if (!StringUtils.hasText(apiKeyHeader)) {
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "Missing required X-API-Key or Bearer API key header", request.getRequestURI());
            return;
        }

        // 2. Safe prefix and candidate lookup
        String submittedKey = apiKeyHeader.trim();
        String prefix = extractPrefix(submittedKey);
        if (prefix == null) {
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "Malformed API key format", request.getRequestURI());
            return;
        }

        List<ApiKey> candidates = apiKeyRepository.findByKeyPrefix(prefix);
        if (candidates.isEmpty()) {
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "Invalid API Key", request.getRequestURI());
            return;
        }

        // 3. Constant-time hash verification
        String submittedHash = ApiKeyGenerator.sha256Hex(submittedKey);
        Optional<ApiKey> matchedKey = candidates.stream()
                .filter(k -> ApiKeyGenerator.constantTimeEquals(k.getKeyHash(), submittedHash))
                .findFirst();

        if (matchedKey.isEmpty()) {
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "Invalid API Key", request.getRequestURI());
            return;
        }

        ApiKey apiKey = matchedKey.get();

        // 4. Status and expiration check
        if (apiKey.getStatus() == KeyStatus.REVOKED) {
            long duration = System.currentTimeMillis() - startTime;
            apiUsageService.recordUsage(apiKey, request.getRequestURI(), request.getMethod(), HttpStatus.FORBIDDEN.value(), duration);
            sendErrorResponse(response, HttpStatus.FORBIDDEN, "API Key has been revoked", request.getRequestURI());
            return;
        }

        if (apiKey.isExpired()) {
            long duration = System.currentTimeMillis() - startTime;
            apiUsageService.recordUsage(apiKey, request.getRequestURI(), request.getMethod(), HttpStatus.FORBIDDEN.value(), duration);
            sendErrorResponse(response, HttpStatus.FORBIDDEN, "API Key has expired", request.getRequestURI());
            return;
        }

        // 5. Concurrency-safe Quota validation & atomic counter increment
        try {
            quotaEnforcementService.checkAndIncrementQuota(apiKey);
        } catch (QuotaExceededException ex) {
            long duration = System.currentTimeMillis() - startTime;
            apiUsageService.recordUsage(apiKey, request.getRequestURI(), request.getMethod(), HttpStatus.TOO_MANY_REQUESTS.value(), duration);
            sendErrorResponse(response, HttpStatus.TOO_MANY_REQUESTS, ex.getMessage(), request.getRequestURI());
            return;
        }

        // 6. Set Authentication in SecurityContext
        request.setAttribute(CURRENT_API_KEY_ATTR, apiKey);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                apiKey.getKeyPrefix(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_API_CLIENT"))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();
            apiUsageService.recordUsage(apiKey, request.getRequestURI(), request.getMethod(), status, duration);
        }
    }

    private String extractPrefix(String key) {
        // Expected format: ak_live_<8 hex>_<secret> -> prefix is ak_live_<8 hex>
        int secondUnderscore = key.indexOf('_', "ak_live_".length());
        if (secondUnderscore > 0) {
            return key.substring(0, secondUnderscore);
        }
        return null;
    }

    private void sendErrorResponse(HttpServletResponse response, HttpStatus status, String message, String path)
            throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ErrorResponse errorResponse = new ErrorResponse(status.value(), status.getReasonPhrase(), message, path);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
