package com.example.apiplatform.service;

import com.example.apiplatform.dto.apikey.ApiKeyCreatedResponse;
import com.example.apiplatform.dto.apikey.ApiKeyResponse;
import com.example.apiplatform.dto.apikey.CreateApiKeyRequest;
import com.example.apiplatform.dto.apikey.UpdateApiKeyRequest;
import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.entity.User;
import com.example.apiplatform.enums.KeyStatus;
import com.example.apiplatform.exception.ForbiddenException;
import com.example.apiplatform.exception.ResourceNotFoundException;
import com.example.apiplatform.repository.ApiKeyRepository;
import com.example.apiplatform.repository.UserRepository;
import com.example.apiplatform.util.ApiKeyGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;

    public ApiKeyService(ApiKeyRepository apiKeyRepository, UserRepository userRepository) {
        this.apiKeyRepository = apiKeyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ApiKeyCreatedResponse createApiKey(Long userId, CreateApiKeyRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        ApiKeyGenerator.GeneratedKey generated = ApiKeyGenerator.generate();

        Instant expiresAt = null;
        if (request.getExpiresInDays() != null && request.getExpiresInDays() > 0) {
            expiresAt = Instant.now().plus(request.getExpiresInDays(), ChronoUnit.DAYS);
        }

        ApiKey apiKey = new ApiKey(
                user,
                request.getName().trim(),
                generated.prefix(),
                generated.hash(),
                KeyStatus.ACTIVE,
                request.getDailyQuota(),
                request.getMonthlyQuota(),
                expiresAt
        );

        ApiKey saved = apiKeyRepository.save(apiKey);

        return new ApiKeyCreatedResponse(
                saved.getId(),
                saved.getName(),
                generated.rawKey(),
                saved.getKeyPrefix(),
                saved.getStatus(),
                saved.getDailyQuota(),
                saved.getMonthlyQuota(),
                saved.getExpiresAt(),
                saved.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<ApiKeyResponse> getKeysByUserId(Long userId) {
        return apiKeyRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ApiKeyResponse getKeyById(Long id, Long userId) {
        ApiKey apiKey = apiKeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("API Key not found with id: " + id));

        if (!apiKey.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this API Key");
        }

        return toResponse(apiKey);
    }

    @Transactional
    public ApiKeyResponse updateKey(Long id, Long userId, UpdateApiKeyRequest request) {
        ApiKey apiKey = apiKeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("API Key not found with id: " + id));

        if (!apiKey.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to modify this API Key");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            apiKey.setName(request.getName().trim());
        }
        if (request.getStatus() != null) {
            apiKey.setStatus(request.getStatus());
        }
        if (request.getDailyQuota() != null) {
            apiKey.setDailyQuota(request.getDailyQuota());
        }
        if (request.getMonthlyQuota() != null) {
            apiKey.setMonthlyQuota(request.getMonthlyQuota());
        }

        ApiKey updated = apiKeyRepository.save(apiKey);
        return toResponse(updated);
    }

    @Transactional
    public void revokeKey(Long id, Long userId) {
        ApiKey apiKey = apiKeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("API Key not found with id: " + id));

        if (!apiKey.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to revoke this API Key");
        }

        apiKey.setStatus(KeyStatus.REVOKED);
        apiKeyRepository.save(apiKey);
    }

    @Transactional(readOnly = true)
    public Page<ApiKeyResponse> getAllKeysAdmin(Pageable pageable) {
        return apiKeyRepository.findAllWithUser(pageable)
                .map(this::toResponse);
    }

    public ApiKeyResponse toResponse(ApiKey apiKey) {
        return new ApiKeyResponse(
                apiKey.getId(),
                apiKey.getName(),
                apiKey.getKeyPrefix(),
                apiKey.getStatus(),
                apiKey.getDailyQuota(),
                apiKey.getMonthlyQuota(),
                apiKey.getExpiresAt(),
                apiKey.getCreatedAt(),
                apiKey.getUpdatedAt(),
                apiKey.getUser().getId(),
                apiKey.getUser().getEmail()
        );
    }
}
