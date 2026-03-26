package com.nexoria.api.blueprint;

import com.nexoria.api.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/blueprints")
@Tag(name = "Blueprints", description = "Authenticated blueprint CRUD and diagnostic endpoints.")
@SecurityRequirement(name = "bearerAuth")
public class BlueprintController {

    private final BlueprintService service;

    public BlueprintController(BlueprintService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List the current user's blueprints")
    public List<Blueprint> getAll(@AuthenticationPrincipal User user) {
        return service.findAllByUser(user);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Fetch a blueprint by id")
    public ResponseEntity<Blueprint> getById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return service.findByIdAndUser(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create and score a blueprint")
    public ResponseEntity<Blueprint> create(@Valid @RequestBody BlueprintRequest request, @AuthenticationPrincipal User user) {
        Blueprint saved = service.computeAndSave(request, user);
        return ResponseEntity.created(URI.create("/api/blueprints/" + saved.getId())).body(saved);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update and rescore an existing blueprint")
    public ResponseEntity<Blueprint> update(@PathVariable Long id, @Valid @RequestBody BlueprintRequest request, @AuthenticationPrincipal User user) {
        return service.findByIdAndUser(id, user)
                .map(existing -> {
                    existing.setUrl(request.getUrl());
                    existing.setIndustry(request.getIndustry());
                    existing.setRevenueRange(request.getRevenueRange());
                    existing.setGoals(request.getGoals());
                    existing.setExternalSignal(request.getExternalSignal());
                    int score = service.computeScore(existing.getIndustry(), existing.getRevenueRange(), existing.getGoals(), existing.getExternalSignal());
                    existing.setScore(score);
                    existing.setReadyForRetainer(service.isReadyForRetainer(score, existing.getRevenueRange()));
                    existing.setFixes(service.buildFixes(existing.getGoals(), score, existing.getExternalSignal()));
                    service.save(existing);
                    return ResponseEntity.ok(existing);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a blueprint")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (service.findByIdAndUser(id, user).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/diagnostic")
    @Operation(summary = "Create a diagnostic blueprint result for the authenticated user")
    public Blueprint diagnostic(@Valid @RequestBody BlueprintRequest request, @AuthenticationPrincipal User user) {
        return service.computeAndSave(request, user);
    }
}

