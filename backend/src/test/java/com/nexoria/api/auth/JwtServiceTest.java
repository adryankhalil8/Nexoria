package com.nexoria.api.auth;

import com.nexoria.api.user.User;
import com.nexoria.api.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String testSecret = "dGVzdC1qd3Qtc2VjcmV0LWZvci10ZXN0aW5nLXB1cnBvc2VzLW9ubHk="; // base64 encoded
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", testSecret);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 3600000L); // 1 hour
        ReflectionTestUtils.setField(jwtService, "refreshExpiration", 86400000L); // 24 hours

        testUser = new User("test@example.com", "password", Role.USER);
    }

    @Test
    void generateToken_ShouldReturnValidToken() {
        // When
        String token = jwtService.generateToken(testUser);

        // Then
        assertNotNull(token);
        assertTrue(token.length() > 0);
        assertEquals("test@example.com", jwtService.extractUsername(token));
    }

    @Test
    void validateToken_ValidToken_ShouldReturnTrue() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When & Then
        assertTrue(jwtService.isTokenValid(token, testUser));
    }

    @Test
    void validateToken_InvalidUsername_ShouldReturnFalse() {
        // Given
        String token = jwtService.generateToken(testUser);
        User wrongUser = new User("wrong@example.com", "password", Role.USER);

        // When & Then
        assertFalse(jwtService.isTokenValid(token, wrongUser));
    }

    @Test
    void generateRefreshToken_ShouldReturnValidToken() {
        // When
        String refreshToken = jwtService.generateRefreshToken(testUser);

        // Then
        assertNotNull(refreshToken);
        assertTrue(refreshToken.length() > 0);
        assertEquals("test@example.com", jwtService.extractUsername(refreshToken));
    }
}