package com.example.apiplatform.repository;

import com.example.apiplatform.dto.usage.DayUsageProjection;
import com.example.apiplatform.dto.usage.EndpointUsageProjection;
import com.example.apiplatform.entity.ApiUsageLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ApiUsageLogRepository extends JpaRepository<ApiUsageLog, Long>, JpaSpecificationExecutor<ApiUsageLog> {

    @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.apiKey.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.apiKey.user.id = :userId AND l.timestamp >= :since")
    long countByUserIdSince(@Param("userId") Long userId, @Param("since") Instant since);

    @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.apiKey.user.id = :userId AND l.responseStatus >= 200 AND l.responseStatus < 300")
    long countSuccessfulByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.apiKey.user.id = :userId AND l.responseStatus >= 400")
    long countFailedByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(AVG(l.responseTimeMs), 0.0) FROM ApiUsageLog l WHERE l.apiKey.user.id = :userId")
    double avgResponseTimeByUserId(@Param("userId") Long userId);

    // Global counts for admin
    @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.timestamp >= :since")
    long countGlobalSince(@Param("since") Instant since);

    @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.responseStatus >= 200 AND l.responseStatus < 300")
    long countGlobalSuccessful();

    @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.responseStatus >= 400")
    long countGlobalFailed();

    @Query("SELECT COALESCE(AVG(l.responseTimeMs), 0.0) FROM ApiUsageLog l")
    double avgResponseTimeGlobal();

    // Group by day - User
    @Query(value = "SELECT DATE_FORMAT(l.timestamp, '%Y-%m-%d') AS day, COUNT(*) AS count " +
                   "FROM api_usage_logs l " +
                   "JOIN api_keys k ON l.api_key_id = k.id " +
                   "WHERE k.user_id = :userId AND l.timestamp >= :since " +
                   "GROUP BY DATE_FORMAT(l.timestamp, '%Y-%m-%d') " +
                   "ORDER BY day ASC", nativeQuery = true)
    List<DayUsageProjection> findDailyUsageByUser(@Param("userId") Long userId, @Param("since") Instant since);

    // Group by day - Admin
    @Query(value = "SELECT DATE_FORMAT(l.timestamp, '%Y-%m-%d') AS day, COUNT(*) AS count " +
                   "FROM api_usage_logs l " +
                   "WHERE l.timestamp >= :since " +
                   "GROUP BY DATE_FORMAT(l.timestamp, '%Y-%m-%d') " +
                   "ORDER BY day ASC", nativeQuery = true)
    List<DayUsageProjection> findDailyUsageGlobal(@Param("since") Instant since);

    // Group by endpoint - User
    @Query(value = "SELECT l.endpoint AS endpoint, l.http_method AS httpMethod, COUNT(*) AS count " +
                   "FROM api_usage_logs l " +
                   "JOIN api_keys k ON l.api_key_id = k.id " +
                   "WHERE k.user_id = :userId AND l.timestamp >= :since " +
                   "GROUP BY l.endpoint, l.http_method " +
                   "ORDER BY count DESC", nativeQuery = true)
    List<EndpointUsageProjection> findEndpointUsageByUser(@Param("userId") Long userId, @Param("since") Instant since);

    // Group by endpoint - Admin
    @Query(value = "SELECT l.endpoint AS endpoint, l.http_method AS httpMethod, COUNT(*) AS count " +
                   "FROM api_usage_logs l " +
                   "WHERE l.timestamp >= :since " +
                   "GROUP BY l.endpoint, l.http_method " +
                   "ORDER BY count DESC", nativeQuery = true)
    List<EndpointUsageProjection> findEndpointUsageGlobal(@Param("since") Instant since);

    @Query("SELECT l FROM ApiUsageLog l JOIN FETCH l.apiKey k WHERE k.user.id = :userId ORDER BY l.timestamp DESC")
    Page<ApiUsageLog> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT l FROM ApiUsageLog l JOIN FETCH l.apiKey k WHERE k.id = :apiKeyId AND k.user.id = :userId ORDER BY l.timestamp DESC")
    Page<ApiUsageLog> findByApiKeyIdAndUserId(@Param("apiKeyId") Long apiKeyId, @Param("userId") Long userId, Pageable pageable);

    @Query("SELECT l FROM ApiUsageLog l JOIN FETCH l.apiKey k ORDER BY l.timestamp DESC")
    Page<ApiUsageLog> findAllLogs(Pageable pageable);
}
