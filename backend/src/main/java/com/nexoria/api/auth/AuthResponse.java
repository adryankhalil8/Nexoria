package com.nexoria.api.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import com.nexoria.api.user.Role;

@Schema(name = "AuthResponse", description = "Access and refresh tokens issued by the API.")
public class AuthResponse {

    @Schema(example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;
    @Schema(example = "eyJhbGciOiJIUzI1NiJ9...")
    private String refreshToken;
    @Schema(example = "ADMIN")
    private Role role;

    // Default constructor
    public AuthResponse() {}

    // Constructor
    public AuthResponse(String token, String refreshToken, Role role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.role = role;
    }

    // Builder pattern
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    // Builder class
    public static class AuthResponseBuilder {
        private String token;
        private String refreshToken;
        private Role role;

        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseBuilder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }

        public AuthResponseBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(token, refreshToken, role);
        }
    }
}
