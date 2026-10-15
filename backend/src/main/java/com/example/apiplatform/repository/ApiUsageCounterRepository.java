package com.example.apiplatform.repository;

import com.example.apiplatform.entity.ApiUsageCounter;
import com.example.apiplatform.enums.QuotaWindow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface ApiUsageCounterRepository extends JpaRepository<ApiUsageCounter, Long> {

    Optional<ApiUsageCounter> findByApiKeyIdAndWindowTypeAndWindowKey(
            Long apiKeyId, QuotaWindow windowType, String windowKey);

    @Modifying
    @Query(value = "INSERT IGNORE INTO api_usage_counters (api_key_id, window_type, window_key, request_count, updated_at) " +
                   "VALUES (:apiKeyId, :windowType, :windowKey, 0, :now)", nativeQuery = true)
    void ensureCounterExists(@Param("apiKeyId") Long apiKeyId,
                             @Param("windowType") String windowType,
                             @Param("windowKey") String windowKey,
                             @Param("now") Instant now);

    @Modifying
    @Query("UPDATE ApiUsageCounter c SET c.requestCount = c.requestCount + 1, c.updatedAt = :now " +
           "WHERE c.apiKey.id = :apiKeyId AND c.windowType = :windowType AND c.windowKey = :windowKey " +
           "AND (:quota IS NULL OR c.requestCount < :quota)")
    int atomicIncrementIfUnderQuota(@Param("apiKeyId") Long apiKeyId,
                                   @Param("windowType") QuotaWindow windowType,
                                   @Param("windowKey") String windowKey,
                                   @Param("quota") Integer quota,
                                   @Param("now") Instant now);

    @Query("SELECT COALESCE(c.requestCount, 0) FROM ApiUsageCounter c " +
           "WHERE c.apiKey.id = :apiKeyId AND c.windowType = :windowType AND c.windowKey = :windowKey")
    Optional<Long> getCount(@Param("apiKeyId") Long apiKeyId,
                            @Param("windowType") QuotaWindow windowType,
                            @Param("windowKey") String windowKey);

    @Query("SELECT COALESCE(SUM(c.requestCount), 0) FROM ApiUsageCounter c " +
           "WHERE c.apiKey.user.id = :userId AND c.windowType = :windowType AND c.windowKey = :windowKey")
    Long sumByUserAndWindow(@Param("userId") Long userId,
                            @Param("windowType") QuotaWindow windowType,
                            @Param("windowKey") String windowKey);
}
