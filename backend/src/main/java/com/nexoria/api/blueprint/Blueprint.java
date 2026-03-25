package com.nexoria.api.blueprint;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "blueprints")
public class Blueprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String url;

    @NotBlank
    @Column(nullable = false)
    private String industry;

    @NotBlank
    @Column(nullable = false)
    private String revenueRange;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "blueprint_goals", joinColumns = @JoinColumn(name = "blueprint_id"))
    @Column(name = "goal")
    private List<String> goals = new ArrayList<>();

    @NotNull
    @Column(nullable = false)
    private Integer score;

    @NotNull
    @Column(nullable = false)
    private Boolean readyForRetainer;

    @Embedded
    private ExternalSignal externalSignal;

    @ElementCollection
    @CollectionTable(name = "blueprint_fixes", joinColumns = @JoinColumn(name = "blueprint_id"))
    private List<FixRecommendation> fixes = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public Blueprint() {
    }

    // Getters and setters omitted for brevity (IDE generate or use Lombok in future)

    // ... include all getters/setters ...

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getRevenueRange() { return revenueRange; }
    public void setRevenueRange(String revenueRange) { this.revenueRange = revenueRange; }
    public List<String> getGoals() { return goals; }
    public void setGoals(List<String> goals) { this.goals = goals; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Boolean getReadyForRetainer() { return readyForRetainer; }
    public void setReadyForRetainer(Boolean readyForRetainer) { this.readyForRetainer = readyForRetainer; }
    public ExternalSignal getExternalSignal() { return externalSignal; }
    public void setExternalSignal(ExternalSignal externalSignal) { this.externalSignal = externalSignal; }
    public List<FixRecommendation> getFixes() { return fixes; }
    public void setFixes(List<FixRecommendation> fixes) { this.fixes = fixes; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
