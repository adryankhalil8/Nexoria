package com.nexoria.api.lead;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@Tag(name = "Leads", description = "Authenticated lead tracking endpoints for the admin area.")
@SecurityRequirement(name = "bearerAuth")
public class LeadController {
    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    @Operation(summary = "List leads with optional search and status filtering")
    public List<LeadResponse> list(@RequestParam(required = false) String search,
                                   @RequestParam(required = false) LeadStatus status) {
        return leadService.list(search, status);
    }

    @PostMapping
    @Operation(summary = "Create a lead")
    public ResponseEntity<LeadResponse> create(@Valid @RequestBody LeadRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leadService.create(request));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a lead")
    public LeadResponse update(@PathVariable Long id, @Valid @RequestBody LeadRequest request) {
        return leadService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a lead")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
