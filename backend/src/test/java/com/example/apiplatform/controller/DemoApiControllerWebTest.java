package com.example.apiplatform.controller;

import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.entity.User;
import com.example.apiplatform.enums.KeyStatus;
import com.example.apiplatform.enums.Role;
import com.example.apiplatform.exception.QuotaExceededException;
import com.example.apiplatform.repository.ApiKeyRepository;
import com.example.apiplatform.security.ApiKeyAuthenticationFilter;
import com.example.apiplatform.service.ApiUsageService;
import com.example.apiplatform.service.QuotaEnforcementService;
import com.example.apiplatform.util.ApiKeyGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class DemoApiControllerWebTest {

    private MockMvc mockMvc;

    @Mock
    private ApiKeyRepository apiKeyRepository;

    @Mock
    private QuotaEnforcementService quotaEnforcementService;

    @Mock
    private ApiUsageService apiUsageService;

    private String validRawKey;
    private ApiKey validApiKey;

    @BeforeEach
    void setUp() {
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

        ApiKeyAuthenticationFilter filter = new ApiKeyAuthenticationFilter(
                apiKeyRepository,
                quotaEnforcementService,
                apiUsageService,
                objectMapper
        );

        mockMvc = MockMvcBuilders.standaloneSetup(new DemoApiController())
                .addFilters(filter)
                .build();

        ApiKeyGenerator.GeneratedKey gen = ApiKeyGenerator.generate();
        validRawKey = gen.rawKey();

        User user = new User("client@example.com", "pass", "Client User", Role.ROLE_USER);
        user.setId(5L);

        validApiKey = new ApiKey(user, "Demo Key", gen.prefix(), gen.hash(), KeyStatus.ACTIVE, 100, 1000, null);
        validApiKey.setId(55L);
    }

    @Test
    @DisplayName("Request without X-API-Key header should return 401 Unauthorized")
    void testMissingApiKeyHeader() throws Exception {
        mockMvc.perform(get("/api/v1/demo/profile"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Missing required X-API-Key request header"));
    }

    @Test
    @DisplayName("Request with invalid or unmapped X-API-Key should return 401 Unauthorized")
    void testInvalidApiKey() throws Exception {
        when(apiKeyRepository.findByKeyPrefix(anyString())).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/demo/profile")
                        .header("X-API-Key", "ak_live_unknown_1234567890abcdef"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Invalid API Key"));
    }

    @Test
    @DisplayName("Request with valid X-API-Key should return 200 OK")
    void testValidApiKeySuccess() throws Exception {
        when(apiKeyRepository.findByKeyPrefix(validApiKey.getKeyPrefix()))
                .thenReturn(List.of(validApiKey));
        doNothing().when(quotaEnforcementService).checkAndIncrementQuota(validApiKey);

        mockMvc.perform(get("/api/v1/demo/profile")
                        .header("X-API-Key", validRawKey))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.prefix").value(validApiKey.getKeyPrefix()));

        verify(quotaEnforcementService).checkAndIncrementQuota(validApiKey);
        verify(apiUsageService).recordUsage(eq(validApiKey), eq("/api/v1/demo/profile"), eq("GET"), eq(200), anyLong());
    }

    @Test
    @DisplayName("Request with revoked X-API-Key should return 403 Forbidden")
    void testRevokedApiKey() throws Exception {
        validApiKey.setStatus(KeyStatus.REVOKED);
        when(apiKeyRepository.findByKeyPrefix(validApiKey.getKeyPrefix()))
                .thenReturn(List.of(validApiKey));

        mockMvc.perform(get("/api/v1/demo/data")
                        .header("X-API-Key", validRawKey))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value("API Key has been revoked"));

        verify(quotaEnforcementService, never()).checkAndIncrementQuota(any());
    }

    @Test
    @DisplayName("Request exceeding quota should return 429 Too Many Requests")
    void testQuotaExceeded() throws Exception {
        when(apiKeyRepository.findByKeyPrefix(validApiKey.getKeyPrefix()))
                .thenReturn(List.of(validApiKey));
        doThrow(new QuotaExceededException("Daily quota limit (100 requests) exceeded for this API key"))
                .when(quotaEnforcementService).checkAndIncrementQuota(validApiKey);

        mockMvc.perform(post("/api/v1/demo/echo")
                        .header("X-API-Key", validRawKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"msg\":\"hello\"}"))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.status").value(429))
                .andExpect(jsonPath("$.message").value("Daily quota limit (100 requests) exceeded for this API key"));

        verify(apiUsageService).recordUsage(eq(validApiKey), eq("/api/v1/demo/echo"), eq("POST"), eq(429), anyLong());
    }
}
