-- =========================================================================
-- API Key & Usage Management Platform - MySQL 8 Database Setup & Schema
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `api_platform_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `api_platform_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_users_email` (`email`),
    CONSTRAINT `chk_user_role` CHECK (`role` IN ('ROLE_USER', 'ROLE_ADMIN'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. API Keys Table
CREATE TABLE IF NOT EXISTS `api_keys` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `key_prefix` VARCHAR(20) NOT NULL,
    `key_hash` VARCHAR(64) NOT NULL UNIQUE,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `daily_quota` INT NULL,
    `monthly_quota` INT NULL,
    `expires_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_api_keys_user_id` (`user_id`),
    KEY `idx_api_keys_prefix` (`key_prefix`),
    KEY `idx_api_keys_hash` (`key_hash`),
    CONSTRAINT `fk_api_keys_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_key_status` CHECK (`status` IN ('ACTIVE', 'REVOKED', 'EXPIRED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. API Usage Counters Table (Concurrency-Safe Quota Window Counters)
CREATE TABLE IF NOT EXISTS `api_usage_counters` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `api_key_id` BIGINT NOT NULL,
    `window_type` VARCHAR(10) NOT NULL,
    `window_key` VARCHAR(20) NOT NULL,
    `request_count` BIGINT NOT NULL DEFAULT 0,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_key_window` (`api_key_id`, `window_type`, `window_key`),
    KEY `idx_counter_lookup` (`api_key_id`, `window_type`, `window_key`),
    CONSTRAINT `fk_counter_key` FOREIGN KEY (`api_key_id`) REFERENCES `api_keys` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_window_type` CHECK (`window_type` IN ('DAILY', 'MONTHLY'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. API Usage Logs Table (Audit and Time-Series Analytics)
CREATE TABLE IF NOT EXISTS `api_usage_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `api_key_id` BIGINT NOT NULL,
    `endpoint` VARCHAR(255) NOT NULL,
    `http_method` VARCHAR(10) NOT NULL,
    `response_status` INT NOT NULL,
    `response_time_ms` BIGINT NOT NULL,
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_usage_key_ts` (`api_key_id`, `timestamp`),
    KEY `idx_usage_ts_status` (`timestamp`, `response_status`),
    KEY `idx_usage_endpoint` (`endpoint`),
    CONSTRAINT `fk_logs_key` FOREIGN KEY (`api_key_id`) REFERENCES `api_keys` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
