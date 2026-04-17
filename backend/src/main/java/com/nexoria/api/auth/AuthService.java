package com.nexoria.api.auth;

import com.nexoria.api.user.User;
import com.nexoria.api.user.UserRepository;
import com.nexoria.api.user.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final String adminBootstrapSecret;

    public AuthService(UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtService jwtService,
                      AuthenticationManager authenticationManager,
                      @Value("${ADMIN_BOOTSTRAP_SECRET:}") String adminBootstrapSecret) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.adminBootstrapSecret = adminBootstrapSecret;
    }

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User already exists with email: " + request.getEmail());
        }

        User user = new User(
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            Role.USER
        );
        user.setUsernameValue(generateUniqueUsername(request.getEmail()));

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .build();
    }

    public AuthResponse bootstrapAdmin(AdminBootstrapRequest request) {
        if (adminBootstrapSecret == null || adminBootstrapSecret.isBlank()) {
            throw new IllegalStateException("Admin bootstrap is not configured.");
        }

        if (!adminBootstrapSecret.equals(request.getBootstrapSecret())) {
            throw new IllegalArgumentException("Invalid admin bootstrap secret.");
        }

        if (userRepository.existsByRole(Role.ADMIN)) {
            throw new IllegalArgumentException("An admin account already exists. Use the admin workspace to manage users.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User already exists with email: " + request.getEmail());
        }

        User user = new User(
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            Role.ADMIN
        );
        user.setUsernameValue(generateUniqueUsername(request.getEmail()));

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        User user = (User) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (jwtService.isTokenValid(refreshToken, user)) {
            String newAccessToken = jwtService.generateToken(user);
            return AuthResponse.builder()
                    .token(newAccessToken)
                    .refreshToken(refreshToken)
                    .role(user.getRole())
                    .build();
        } else {
            throw new IllegalArgumentException("Invalid refresh token");
        }
    }

    private String generateUniqueUsername(String email) {
        String base = email
                .trim()
                .replace("@", "_at_")
                .replaceAll("[^a-zA-Z0-9_]", "_");

        if (base.isBlank()) {
            base = "user";
        }

        base = base.length() > 28 ? base.substring(0, 28) : base;

        String candidate = base;
        int suffix = 1;

        while (userRepository.existsByUsername(candidate)) {
            candidate = base + "_" + suffix;
            if (candidate.length() > 32) {
                candidate = candidate.substring(0, 32);
            }
            suffix++;
        }

        return candidate;
    }
}
