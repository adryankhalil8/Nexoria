package com.nexoria.api.blueprint;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexoria.api.config.RateLimitProperties;
import com.nexoria.api.config.SecurityProperties;
import com.nexoria.api.auth.AuthService;
import com.nexoria.api.auth.JwtService;
import com.nexoria.api.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = BlueprintController.class, excludeAutoConfiguration = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@AutoConfigureMockMvc(addFilters = false)
class BlueprintControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private BlueprintService service;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private AuthService authService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private RateLimitProperties rateLimitProperties;

    @MockBean
    private SecurityProperties securityProperties;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createBlueprint_ShouldReturnBlueprint() throws Exception {
        // Given
        BlueprintRequest request = new BlueprintRequest();
        request.setUrl("https://example.com");
        request.setIndustry("Technology");
        request.setRevenueRange("$1M-$10M");
        request.setGoals(List.of("Increase revenue", "Improve customer satisfaction"));

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");

        Blueprint blueprint = new Blueprint();
        blueprint.setId(1L);
        blueprint.setUrl("https://example.com");

        given(service.computeAndSave(any(BlueprintRequest.class), any(User.class))).willReturn(blueprint);

        // When & Then
        mvc.perform(post("/api/blueprints")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.url").value("https://example.com"));
    }
}
