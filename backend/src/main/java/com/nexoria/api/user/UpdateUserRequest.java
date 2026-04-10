package com.nexoria.api.user;

import jakarta.validation.constraints.Size;

public class UpdateUserRequest {
    @Size(min = 3, max = 32)
    private String username;

    private Role role;
    private UserStatus status;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
