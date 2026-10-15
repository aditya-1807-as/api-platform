package com.example.apiplatform.service;

import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.entity.User;
import com.example.apiplatform.enums.KeyStatus;
import com.example.apiplatform.enums.QuotaWindow;
import com.example.apiplatform.enums.Role;
import com.example.apiplatform.exception.QuotaExceededException;
import com.example.apiplatform.repository.ApiUsageCounterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuotaEnforcementServiceTest {

    @Mock
    private ApiUsageCounterRepository counterRepository;

    private QuotaEnforcementService quotaService;
    private ApiKey apiKey;

    @BeforeEach
    void setUp() {
        quotaService = new QuotaEnforcementService(counterRepository);

        User user = new User("dev@example.com", "pass", "Developer", Role.ROLE_USER);
        user.setId(1L);

        apiKey = new ApiKey(user, "Test Key", "ak_live_test", "hash", KeyStatus.ACTIVE, 100, 1000, null);
        apiKey.setId(10L);
    }

    @Test
    @DisplayName("Should successfully check and increment quota when request is within daily and monthly limits")
    void testQuotaWithinLimits() {
        when(counterRepository.atomicIncrementIfUnderQuota(eq(10L), eq(QuotaWindow.DAILY), anyString(), eq(100), any(Instant.class)))
                .thenReturn(1);
        when(counterRepository.atomicIncrementIfUnderQuota(eq(10L), eq(QuotaWindow.MONTHLY), anyString(), eq(1000), any(Instant.class)))
                .thenReturn(1);

        assertDoesNotThrow(() -> quotaService.checkAndIncrementQuota(apiKey));

        verify(counterRepository).ensureCounterExists(eq(10L), eq("DAILY"), anyString(), any(Instant.class));
        verify(counterRepository).ensureCounterExists(eq(10L), eq("MONTHLY"), anyString(), any(Instant.class));
    }

    @Test
    @DisplayName("Should throw QuotaExceededException when daily quota is exceeded")
    void testDailyQuotaExceeded() {
        // Daily atomic update fails (returns 0 because counter is already at or above limit 100)
        when(counterRepository.atomicIncrementIfUnderQuota(eq(10L), eq(QuotaWindow.DAILY), anyString(), eq(100), any(Instant.class)))
                .thenReturn(0);

        QuotaExceededException ex = assertThrows(
                QuotaExceededException.class,
                () -> quotaService.checkAndIncrementQuota(apiKey)
        );

        assertTrue(ex.getMessage().contains("Daily quota limit"));
        // Monthly check should not be attempted if daily check fails
        verify(counterRepository, never()).atomicIncrementIfUnderQuota(eq(10L), eq(QuotaWindow.MONTHLY), anyString(), anyInt(), any());
    }

    @Test
    @DisplayName("Should throw QuotaExceededException when monthly quota is exceeded")
    void testMonthlyQuotaExceeded() {
        when(counterRepository.atomicIncrementIfUnderQuota(eq(10L), eq(QuotaWindow.DAILY), anyString(), eq(100), any(Instant.class)))
                .thenReturn(1);
        // Monthly atomic update fails (returns 0 because monthly limit reached)
        when(counterRepository.atomicIncrementIfUnderQuota(eq(10L), eq(QuotaWindow.MONTHLY), anyString(), eq(1000), any(Instant.class)))
                .thenReturn(0);

        QuotaExceededException ex = assertThrows(
                QuotaExceededException.class,
                () -> quotaService.checkAndIncrementQuota(apiKey)
        );

        assertTrue(ex.getMessage().contains("Monthly quota limit"));
    }

    @Test
    @DisplayName("Unlimited quota (null daily and monthly limits) should always succeed")
    void testUnlimitedQuota() {
        ApiKey unlimitedKey = new ApiKey(apiKey.getUser(), "Unlimited Key", "ak_live_unl", "hash", KeyStatus.ACTIVE, null, null, null);
        unlimitedKey.setId(20L);

        when(counterRepository.atomicIncrementIfUnderQuota(eq(20L), eq(QuotaWindow.DAILY), anyString(), isNull(), any(Instant.class)))
                .thenReturn(1);
        when(counterRepository.atomicIncrementIfUnderQuota(eq(20L), eq(QuotaWindow.MONTHLY), anyString(), isNull(), any(Instant.class)))
                .thenReturn(1);

        assertDoesNotThrow(() -> quotaService.checkAndIncrementQuota(unlimitedKey));
    }
}
