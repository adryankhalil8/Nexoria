package com.nexoria.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexoria.api.auth.AuthRequest;
import com.nexoria.api.lead.Lead;
import com.nexoria.api.lead.LeadRepository;
import com.nexoria.api.lead.LeadStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "app.rate-limit.auth.capacity=2",
        "app.rate-limit.auth.window=PT5M"
})
@AutoConfigureMockMvc
class SecurityConfigIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LeadRepository leadRepository;

    private void seedClosedLead(String email) {
        Lead lead = new Lead();
        lead.setCompany("Security Test Co");
        lead.setContactName("Security Test");
        lead.setEmail(email);
        lead.setStatus(LeadStatus.CLOSED);
        leadRepository.save(lead);
    }

    @Test
    void shouldExposeSecurityHeadersOnPublicEndpoints() throws Exception {
        AuthRequest request = new AuthRequest("headers@example.com", "password123");
        seedClosedLead(request.getEmail());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Content-Security-Policy"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().exists("Referrer-Policy"))
                .andExpect(header().exists("Permissions-Policy"));
    }

    @Test
    void shouldRateLimitAuthEndpoints() throws Exception {
        for (int i = 0; i < 2; i++) {
            AuthRequest request = new AuthRequest("limit-" + UUID.randomUUID() + "@example.com", "password123");
            seedClosedLead(request.getEmail());
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .header("X-Forwarded-For", "203.0.113.10")
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated());
        }

        AuthRequest blockedRequest = new AuthRequest("blocked-" + UUID.randomUUID() + "@example.com", "password123");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Forwarded-For", "203.0.113.10")
                        .content(objectMapper.writeValueAsString(blockedRequest)))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string("X-RateLimit-Limit", "2"));
    }

    @Test
    void shouldExposeOpenApiAndHealthEndpointsWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }
}
