package com.nexoria.api.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AuthResponse", description = "Access and refresh tokens issued by the API.")
public class AuthResponse {

    @Schema(example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;
    @Schema(example = "eyJhbGciOiJIUzI1NiJ9...")
    private String refreshToken;

    // Default constructor
    public AuthResponse() {}

    // Constructor
    public AuthResponse(String token, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
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

    // Builder class
    public static class AuthResponseBuilder {
        private String token;
        private String refreshToken;

        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseBuilder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(token, refreshToken);
        }
    }
}
