package com.nexoria.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexoria.api.lead.Lead;
import com.nexoria.api.lead.LeadRepository;
import com.nexoria.api.lead.LeadStatus;
import com.nexoria.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeadRepository leadRepository;

    private void seedClosedLead(String email) {
        seedLead(email, LeadStatus.CLOSED);
    }

    private void seedLead(String email, LeadStatus status) {
        Lead lead = new Lead();
        lead.setCompany("Test Company");
        lead.setContactName("Test Contact");
        lead.setEmail(email);
        lead.setStatus(status);
        leadRepository.save(lead);
    }

    @Test
    void register_ValidRequest_ShouldReturnTokens() throws Exception {
        // Given
        AuthRequest request = new AuthRequest("integration@test.com", "password123");
        seedClosedLead(request.getEmail());

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    void register_DuplicateEmail_ShouldReturnBadRequest() throws Exception {
        // Given - First register a user
        AuthRequest firstRequest = new AuthRequest("duplicate@test.com", "password123");
        seedClosedLead(firstRequest.getEmail());
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstRequest)))
                .andExpect(status().isCreated());

        // When - Try to register again with same email
        AuthRequest duplicateRequest = new AuthRequest("duplicate@test.com", "differentpassword");

        // Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_ValidCredentials_ShouldReturnTokens() throws Exception {
        // Given - First register a user
        AuthRequest registerRequest = new AuthRequest("login@test.com", "password123");
        seedClosedLead(registerRequest.getEmail());
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // When - Login with same credentials
        AuthRequest loginRequest = new AuthRequest("login@test.com", "password123");

        // Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    void login_InvalidCredentials_ShouldReturnUnauthorized() throws Exception {
        // Given
        AuthRequest request = new AuthRequest("nonexistent@test.com", "wrongpassword");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void register_BookedLeadEmail_ShouldReturnTokens() throws Exception {
        AuthRequest request = new AuthRequest("booked-client@test.com", "password123");
        seedLead(request.getEmail(), LeadStatus.BOOKED);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void register_UnqualifiedLeadEmail_ShouldReturnBadRequest() throws Exception {
        AuthRequest request = new AuthRequest("new-lead@test.com", "password123");
        seedLead(request.getEmail(), LeadStatus.NEW);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
