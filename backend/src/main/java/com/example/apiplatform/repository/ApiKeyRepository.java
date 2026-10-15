package com.example.apiplatform.repository;

import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.enums.KeyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

    List<ApiKey> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<ApiKey> findByUserId(Long userId, Pageable pageable);

    Optional<ApiKey> findByIdAndUserId(Long id, Long userId);

    Optional<ApiKey> findByKeyHash(String keyHash);

    List<ApiKey> findByKeyPrefix(String keyPrefix);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, KeyStatus status);

    @Query("SELECT k FROM ApiKey k JOIN FETCH k.user WHERE k.id = :id")
    Optional<ApiKey> findByIdWithUser(@Param("id") Long id);

    @Query("SELECT k FROM ApiKey k JOIN FETCH k.user")
    Page<ApiKey> findAllWithUser(Pageable pageable);
}
