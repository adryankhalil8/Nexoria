package com.nexoria.api.user;

import com.nexoria.api.lead.LeadService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class UserService {
    private static final String TEMP_PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LeadService leadService;
    private final SecureRandom secureRandom = new SecureRandom();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, LeadService leadService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.leadService = leadService;
    }

    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .map(UserSummaryResponse::from)
                .toList();
    }

    public UserSummaryResponse getCurrentUser(User user) {
        return UserSummaryResponse.from(user);
    }

    public UserSummaryResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("A user already exists with email: " + request.getEmail());
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("A user already exists with username: " + request.getUsername());
        }

        User user = new User(
                request.getEmail(),
                request.getUsername(),
                passwordEncoder.encode(generateTemporaryPassword()),
                request.getRole() == null ? Role.USER : request.getRole(),
                UserStatus.PENDING
        );

        User savedUser = userRepository.save(user);
        leadService.syncClientAccount(savedUser);
        return UserSummaryResponse.from(savedUser);
    }

    public UserSummaryResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsernameValue())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("A user already exists with username: " + request.getUsername());
            }
            user.setUsernameValue(request.getUsername());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        User savedUser = userRepository.save(user);
        leadService.syncClientAccount(savedUser);
        return UserSummaryResponse.from(savedUser);
    }

    public UserSummaryResponse toggleStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setStatus(user.getStatus() == UserStatus.ACTIVE ? UserStatus.PENDING : UserStatus.ACTIVE);
        User savedUser = userRepository.save(user);
        leadService.syncClientAccount(savedUser);
        return UserSummaryResponse.from(savedUser);
    }

    public void deleteUser(Long id, User currentUser) {
        if (currentUser.getId() != null && currentUser.getId().equals(id)) {
            throw new IllegalArgumentException("You cannot delete the current logged-in user.");
        }

        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found");
        }

        userRepository.deleteById(id);
    }

    private String generateTemporaryPassword() {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            int index = secureRandom.nextInt(TEMP_PASSWORD_ALPHABET.length());
            builder.append(TEMP_PASSWORD_ALPHABET.charAt(index));
        }
        return builder.toString();
    }
}
