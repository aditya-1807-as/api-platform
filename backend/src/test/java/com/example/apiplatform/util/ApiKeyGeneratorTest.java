package com.example.apiplatform.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ApiKeyGeneratorTest {

    @Test
    @DisplayName("Generated key should match expected format and contain raw secret, prefix, and SHA-256 hash")
    void testGenerateKey() {
        ApiKeyGenerator.GeneratedKey key = ApiKeyGenerator.generate();

        assertNotNull(key);
        assertNotNull(key.rawKey());
        assertNotNull(key.prefix());
        assertNotNull(key.hash());

        // Check format
        assertTrue(key.rawKey().startsWith("ak_live_"), "Key must start with ak_live_ prefix");
        assertTrue(key.prefix().startsWith("ak_live_"), "Prefix must start with ak_live_");
        assertEquals(64, key.hash().length(), "SHA-256 hash must be 64 hex characters");

        // Verify that hash of rawKey matches the generated hash
        String computedHash = ApiKeyGenerator.sha256Hex(key.rawKey());
        assertEquals(key.hash(), computedHash);
    }

    @Test
    @DisplayName("Two consecutively generated keys must be completely unique")
    void testUniqueKeys() {
        ApiKeyGenerator.GeneratedKey key1 = ApiKeyGenerator.generate();
        ApiKeyGenerator.GeneratedKey key2 = ApiKeyGenerator.generate();

        assertNotEquals(key1.rawKey(), key2.rawKey());
        assertNotEquals(key1.prefix(), key2.prefix());
        assertNotEquals(key1.hash(), key2.hash());
    }

    @Test
    @DisplayName("Constant-time comparison should correctly match identical hashes and reject different ones")
    void testConstantTimeEquals() {
        String hash = ApiKeyGenerator.sha256Hex("test-key-string");
        String identical = ApiKeyGenerator.sha256Hex("test-key-string");
        String different = ApiKeyGenerator.sha256Hex("different-key-string");

        assertTrue(ApiKeyGenerator.constantTimeEquals(hash, identical));
        assertFalse(ApiKeyGenerator.constantTimeEquals(hash, different));
        assertFalse(ApiKeyGenerator.constantTimeEquals(hash, null));
        assertFalse(ApiKeyGenerator.constantTimeEquals(null, hash));
    }
}
