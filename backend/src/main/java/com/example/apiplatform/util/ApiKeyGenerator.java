package com.example.apiplatform.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

public class ApiKeyGenerator {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String PREFIX_HEADER = "ak_live_";

    public record GeneratedKey(String rawKey, String prefix, String hash) {}

    /**
     * Generates a cryptographically secure API key.
     * Format: ak_live_<8 hex prefix>_<64 hex secret>
     * e.g., ak_live_a1b2c3d4_9f8e7d6c5b4a...
     */
    public static GeneratedKey generate() {
        byte[] prefixBytes = new byte[4];
        SECURE_RANDOM.nextBytes(prefixBytes);
        String prefixIdentifier = HexFormat.of().formatHex(prefixBytes);
        String fullPrefix = PREFIX_HEADER + prefixIdentifier;

        byte[] secretBytes = new byte[32];
        SECURE_RANDOM.nextBytes(secretBytes);
        String secretPart = HexFormat.of().formatHex(secretBytes);

        String rawKey = fullPrefix + "_" + secretPart;
        String hash = sha256Hex(rawKey);

        return new GeneratedKey(rawKey, fullPrefix, hash);
    }

    /**
     * Hashes an input raw key using SHA-256 and returns lower-case hex string.
     */
    public static String sha256Hex(String rawKey) {
        if (rawKey == null) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(rawKey.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Constant-time comparison to prevent timing attacks.
     */
    public static boolean constantTimeEquals(String hashA, String hashB) {
        if (hashA == null || hashB == null) {
            return false;
        }
        byte[] a = hashA.getBytes(StandardCharsets.UTF_8);
        byte[] b = hashB.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(a, b);
    }
}
