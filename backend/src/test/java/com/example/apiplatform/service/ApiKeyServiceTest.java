package com.example.apiplatform.service;

import com.example.apiplatform.dto.apikey.ApiKeyCreatedResponse;
import com.example.apiplatform.dto.apikey.ApiKeyResponse;
import com.example.apiplatform.dto.apikey.CreateApiKeyRequest;
import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.entity.User;
import com.example.apiplatform.enums.KeyStatus;
import com.example.apiplatform.enums.Role;
import com.example.apiplatform.exception.ForbiddenException;
import com.example.apiplatform.repository.ApiKeyRepository;
import com.example.apiplatform.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiKeyServiceTest {

    @Mock
    private ApiKeyRepository apiKeyRepository;

    @Mock
    private UserRepository userRepository;

    private ApiKeyService apiKeyService;

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        apiKeyService = new ApiKeyService(apiKeyRepository, userRepository);

        user1 = new User("alice@example.com", "pass", "Alice", Role.ROLE_USER);
        user1.setId(1L);

        user2 = new User("bob@example.com", "pass", "Bob", Role.ROLE_USER);
        user2.setId(2L);
    }

    @Test
    @DisplayName("Create API key should generate valid raw secret and save hash")
    void testCreateApiKey() {
        CreateApiKeyRequest req = new CreateApiKeyRequest("Production Key", 1000, 30000, 30);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        when(apiKeyRepository.save(any(ApiKey.class))).thenAnswer(invocation -> {
            ApiKey key = invocation.getArgument(0);
            key.setId(100L);
            return key;
        });

        ApiKeyCreatedResponse res = apiKeyService.createApiKey(1L, req);

        assertNotNull(res);
        assertEquals(100L, res.getId());
        assertEquals("Production Key", res.getName());
        assertNotNull(res.getRawSecretKey());
        assertTrue(res.getRawSecretKey().startsWith("ak_live_"));
        assertEquals(KeyStatus.ACTIVE, res.getStatus());
        assertEquals(1000, res.getDailyQuota());
        assertEquals(30000, res.getMonthlyQuota());

        // Verify that raw secret was not saved directly as keyHash
        verify(apiKeyRepository).save(argThat(key ->
                !key.getKeyHash().equals(res.getRawSecretKey()) &&
                key.getKeyHash().length() == 64
        ));
    }

    @Test
    @DisplayName("Getting an API key owned by another user should throw ForbiddenException")
    void testGetOtherUserKeyForbidden() {
        ApiKey key = new ApiKey(user2, "Bob's Key", "ak_live_1234", "hash123", KeyStatus.ACTIVE, null, null, null);
        key.setId(50L);

        when(apiKeyRepository.findById(50L)).thenReturn(Optional.of(key));

        // Alice (id 1) attempts to get Bob's (id 2) key
        assertThrows(ForbiddenException.class, () -> apiKeyService.getKeyById(50L, 1L));
    }

    @Test
    @DisplayName("Revoking an API key should set status to REVOKED")
    void testRevokeKey() {
        ApiKey key = new ApiKey(user1, "Alice's Key", "ak_live_1234", "hash123", KeyStatus.ACTIVE, null, null, null);
        key.setId(20L);

        when(apiKeyRepository.findById(20L)).thenReturn(Optional.of(key));

        apiKeyService.revokeKey(20L, 1L);

        assertEquals(KeyStatus.REVOKED, key.getStatus());
        verify(apiKeyRepository).save(key);
    }

    @Test
    @DisplayName("User should only receive their own API keys")
    void testGetUserKeys() {
        ApiKey key = new ApiKey(user1, "Alice's Key", "ak_live_1234", "hash123", KeyStatus.ACTIVE, null, null, null);
        key.setId(21L);

        when(apiKeyRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(key));

        List<ApiKeyResponse> res = apiKeyService.getKeysByUserId(1L);

        assertEquals(1, res.size());
        assertEquals("Alice's Key", res.get(0).getName());
        assertEquals("ak_live_1234", res.get(0).getKeyPrefix());
    }
}
