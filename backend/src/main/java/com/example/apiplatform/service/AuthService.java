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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public UserProfileResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        // First registered user automatically becomes ADMIN, subsequent users are normal USERs
        long count = userRepository.count();
        Role assignedRole = (count == 0) ? Role.ROLE_ADMIN : Role.ROLE_USER;

        User user = new User(
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                assignedRole
        );

        User saved = userRepository.save(user);
        return toProfileResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(userPrincipal);

        UserProfileResponse profile = new UserProfileResponse(
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getFullName(),
                userPrincipal.getRole(),
                null
        );

        return new AuthResponse(token, profile);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));
        return toProfileResponse(user);
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
