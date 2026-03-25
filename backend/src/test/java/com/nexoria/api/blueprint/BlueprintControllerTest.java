package com.nexoria.api.blueprint;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BlueprintController.class)
class BlueprintControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private BlueprintService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void whenPostDiagnostic_thenReturnsSavedBlueprint() throws Exception {
        BlueprintRequest request = new BlueprintRequest();
        request.setUrl("https://example.com");
        request.setIndustry("Tech / SaaS");
        request.setRevenueRange("$50k–$200k/mo");
        request.setGoals(List.of("More leads"));

        Blueprint generated = new Blueprint();
        generated.setId(1L);
        generated.setUrl(request.getUrl());
        generated.setIndustry(request.getIndustry());

        given(service.computeAndSave(any(BlueprintRequest.class))).willReturn(generated);

        mvc.perform(post("/api/blueprints/diagnostic")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }
}
