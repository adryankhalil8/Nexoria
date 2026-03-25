package com.nexoria.api.blueprint;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/blueprints")
public class BlueprintController {

    private final BlueprintService service;

    public BlueprintController(BlueprintService service) {
        this.service = service;
    }

    @GetMapping
    public List<Blueprint> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blueprint> getById(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Blueprint> create(@Validated @RequestBody BlueprintRequest request) {
        Blueprint saved = service.computeAndSave(request);
        return ResponseEntity.created(URI.create("/api/blueprints/" + saved.getId())).body(saved);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Blueprint> update(@PathVariable Long id, @Validated @RequestBody BlueprintRequest request) {
        return service.findById(id).
                map(existing -> {
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
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/diagnostic")
    public Blueprint diagnostic(@Validated @RequestBody BlueprintRequest request) {
        return service.computeAndSave(request);
    }
}

