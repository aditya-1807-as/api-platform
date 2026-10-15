package com.example.apiplatform.service;

import com.example.apiplatform.dto.auth.AuthResponse;
import com.example.apiplatform.dto.auth.LoginRequest;
import com.example.apiplatform.dto.auth.RegisterRequest;
import com.example.apiplatform.dto.auth.UserProfileResponse;
import com.example.apiplatform.entity.User;
import com.example.apiplatform.enums.Role;
import com.example.apiplatform.exception.BadRequestException;
import com.example.apiplatform.repository.UserRepository;
import com.example.apiplatform.security.JwtTokenProvider;
import com.example.apiplatform.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, authenticationManager, tokenProvider);
    }

    @Test
    @DisplayName("Register should hash password and create first user as ROLE_ADMIN")
    void testRegisterFirstUserAdmin() {
        RegisterRequest req = new RegisterRequest("admin@example.com", "Password123!", "Admin User");

        when(userRepository.existsByEmail("admin@example.com")).thenReturn(false);
        when(userRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashedPassword123");

        User savedUser = new User("admin@example.com", "hashedPassword123", "Admin User", Role.ROLE_ADMIN);
        savedUser.setId(1L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserProfileResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("admin@example.com", res.getEmail());
        assertEquals("Admin User", res.getFullName());
        assertEquals(Role.ROLE_ADMIN, res.getRole());
        verify(passwordEncoder).encode("Password123!");
    }

    @Test
    @DisplayName("Register should assign ROLE_USER to subsequent users")
    void testRegisterSubsequentUser() {
        RegisterRequest req = new RegisterRequest("john@example.com", "Password123!", "John Doe");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.count()).thenReturn(1L);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashedPassword123");

        User savedUser = new User("john@example.com", "hashedPassword123", "John Doe", Role.ROLE_USER);
        savedUser.setId(2L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserProfileResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals(Role.ROLE_USER, res.getRole());
    }

    @Test
    @DisplayName("Register with duplicate email should throw BadRequestException")
    void testRegisterDuplicateEmail() {
        RegisterRequest req = new RegisterRequest("existing@example.com", "Password123!", "Existing User");
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Login with valid credentials should return JWT token")
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest("user@example.com", "Password123!");

        User user = new User("user@example.com", "hashed", "Test User", Role.ROLE_USER);
        user.setId(10L);
        UserPrincipal principal = UserPrincipal.create(user);

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(principal)).thenReturn("mock.jwt.token");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("mock.jwt.token", res.getToken());
        assertEquals("Bearer", res.getTokenType());
        assertEquals("user@example.com", res.getUser().getEmail());
    }
}
