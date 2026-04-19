package com.nexoria.api.auth;

import com.nexoria.api.lead.Lead;
import com.nexoria.api.lead.LeadService;
import com.nexoria.api.lead.LeadStatus;
import com.nexoria.api.user.User;
import com.nexoria.api.user.UserRepository;
import com.nexoria.api.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private LeadService leadService;

    private AuthService authService;

    private User testUser;
    private AuthRequest authRequest;

    @BeforeEach
    void setUp() {
        testUser = new User("test@example.com", "encodedPassword", Role.USER);
        authRequest = new AuthRequest("test@example.com", "password");
        authService = new AuthService(userRepository, passwordEncoder, jwtService, authenticationManager, leadService, "test-secret");
    }

    @Test
    void register_Success_ShouldReturnAuthResponse() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        Lead closedLead = new Lead();
        closedLead.setEmail(authRequest.getEmail());
        closedLead.setStatus(LeadStatus.CLOSED);
        when(leadService.requireClosedLead(anyString())).thenReturn(closedLead);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");
        when(jwtService.generateRefreshToken(any(User.class))).thenReturn("refresh-token");

        // When
        AuthResponse response = authService.register(authRequest);

        // Then
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("refresh-token", response.getRefreshToken());
        verify(userRepository).save(any(User.class));
        verify(leadService).syncClientAccount(any(User.class));
    }

    @Test
    void register_UserAlreadyExists_ShouldThrowException() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> authService.register(authRequest));
        assertTrue(exception.getMessage().contains("User already exists"));
    }

    @Test
    void authenticate_Success_ShouldReturnAuthResponse() {
        // Given
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");
        when(jwtService.generateRefreshToken(any(User.class))).thenReturn("refresh-token");

        // When
        AuthResponse response = authService.authenticate(authRequest);

        // Then
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("refresh-token", response.getRefreshToken());
    }

    @Test
    void refreshToken_ValidToken_ShouldReturnNewAuthResponse() {
        // Given
        when(jwtService.extractUsername(anyString())).thenReturn("test@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(jwtService.isTokenValid(anyString(), any(User.class))).thenReturn(true);
        when(jwtService.generateToken(any(User.class))).thenReturn("new-jwt-token");

        // When
        AuthResponse response = authService.refreshToken("refresh-token");

        // Then
        assertNotNull(response);
        assertEquals("new-jwt-token", response.getToken());
        assertEquals("refresh-token", response.getRefreshToken());
    }

    @Test
    void refreshToken_InvalidToken_ShouldThrowException() {
        // Given
        when(jwtService.extractUsername(anyString())).thenReturn("test@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(jwtService.isTokenValid(anyString(), any(User.class))).thenReturn(false);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> authService.refreshToken("invalid-token"));
        assertTrue(exception.getMessage().contains("Invalid refresh token"));
    }

}
