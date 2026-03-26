package com.nexoria.api.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(name = "AuthRequest", description = "Authentication request payload.")
public class AuthRequest {

    @Email
    @NotBlank
    @Schema(example = "founder@nexoria.io")
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Schema(example = "S3curePassw0rd!")
    private String password;

    // Default constructor
    public AuthRequest() {}

    // Constructor
    public AuthRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
