package com.nexoria.api.security;

import com.nexoria.api.blueprint.Blueprint;
import com.nexoria.api.blueprint.BlueprintRepository;
import com.nexoria.api.blueprint.BlueprintStatus;
import com.nexoria.api.blueprint.ExternalSignal;
import com.nexoria.api.blueprint.FixRecommendation;
import com.nexoria.api.blueprint.PurchaseEventType;
import com.nexoria.api.blueprint.TaskOwner;
import com.nexoria.api.blueprint.TaskStatus;
import com.nexoria.api.auth.JwtService;
import com.nexoria.api.user.Role;
import com.nexoria.api.user.User;
import com.nexoria.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ClientEndpointAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private BlueprintRepository blueprintRepository;

    @Test
    void adminTokenCannotUseClientMineEndpoints() throws Exception {
        String token = issueToken(Role.ADMIN);

        mockMvc.perform(get("/api/scheduling/bookings/mine")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/support/messages/mine")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void clientTokenCanUseClientMineEndpoints() throws Exception {
        String token = issueToken(Role.USER);

        mockMvc.perform(get("/api/scheduling/bookings/mine")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/support/messages/mine")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void clientBlueprintReadsOnlyReturnApprovedClientVisibleData() throws Exception {
        User client = saveUser(Role.USER);
        User admin = saveUser(Role.ADMIN);
        String token = jwtService.generateToken(client);
        Blueprint approved = saveBlueprint(admin, client.getEmail(), BlueprintStatus.APPROVED);
        Blueprint draft = saveBlueprint(admin, client.getEmail(), BlueprintStatus.DRAFT);

        mockMvc.perform(get("/api/blueprints")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(approved.getId()))
                .andExpect(jsonPath("$[0].status").value("APPROVED"))
                .andExpect(jsonPath("$[0].fixes.length()").value(1))
                .andExpect(jsonPath("$[0].fixes[0].title").value("Visible Fix"));

        mockMvc.perform(get("/api/blueprints/" + approved.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fixes.length()").value(1))
                .andExpect(jsonPath("$.fixes[0].title").value("Visible Fix"));

        mockMvc.perform(get("/api/blueprints/" + draft.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    private String issueToken(Role role) {
        return jwtService.generateToken(saveUser(role));
    }

    private User saveUser(Role role) {
        String email = role.name().toLowerCase() + "-authz-" + UUID.randomUUID() + "@example.com";
        User user = new User(email, "password123", role);
        return userRepository.save(user);
    }

    private Blueprint saveBlueprint(User owner, String clientEmail, BlueprintStatus status) {
        Blueprint blueprint = new Blueprint();
        blueprint.setUser(owner);
        blueprint.setUrl("https://client.example.com");
        blueprint.setIndustry("Consulting");
        blueprint.setRevenueRange("$10k-$50k/mo");
        blueprint.setClientEmail(clientEmail);
        blueprint.setGoals(List.of("More leads", "Grow revenue"));
        blueprint.setScore(72);
        blueprint.setReadyForRetainer(false);
        blueprint.setStatus(status);
        blueprint.setPurchaseEventType(PurchaseEventType.BOOKED_JOB);
        blueprint.setExternalSignal(new ExternalSignal(10.0, 0, 72.0));
        blueprint.setFixes(List.of(
                new FixRecommendation("Visible Fix", "High", "Low", "Client should see this", TaskOwner.CLIENT, TaskStatus.NOT_STARTED, true),
                new FixRecommendation("Hidden Fix", "High", "High", "Internal-only admin work", TaskOwner.NEXORIA, TaskStatus.IN_PROGRESS, false)
        ));
        return blueprintRepository.save(blueprint);
    }
}
