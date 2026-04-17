package com.nexoria.api.blueprint;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Embeddable
@Schema(name = "FixRecommendation", description = "Recommended fix emitted by blueprint scoring.")
public class FixRecommendation {

    @Schema(example = "Improve homepage load speed")
    private String title;
    @Schema(example = "High")
    private String impact;
    @Schema(example = "Medium")
    private String effort;
    @Schema(example = "Slow pages lower conversion and SEO performance.")
    private String why;

    @Enumerated(EnumType.STRING)
    @Schema(example = "NEXORIA")
    private TaskOwner owner = TaskOwner.NEXORIA;

    @Enumerated(EnumType.STRING)
    @Schema(example = "NOT_STARTED")
    private TaskStatus status = TaskStatus.NOT_STARTED;

    @Schema(example = "true")
    private Boolean clientVisible = true;

    public FixRecommendation() {}

    public FixRecommendation(String title, String impact, String effort, String why) {
        this(title, impact, effort, why, TaskOwner.NEXORIA, TaskStatus.NOT_STARTED, true);
    }

    public FixRecommendation(String title, String impact, String effort, String why, TaskOwner owner, TaskStatus status, Boolean clientVisible) {
        this.title = title;
        this.impact = impact;
        this.effort = effort;
        this.why = why;
        this.owner = owner;
        this.status = status;
        this.clientVisible = clientVisible;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImpact() {
        return impact;
    }

    public void setImpact(String impact) {
        this.impact = impact;
    }

    public String getEffort() {
        return effort;
    }

    public void setEffort(String effort) {
        this.effort = effort;
    }

    public String getWhy() {
        return why;
    }

    public void setWhy(String why) {
        this.why = why;
    }

    public TaskOwner getOwner() {
        return owner;
    }

    public void setOwner(TaskOwner owner) {
        this.owner = owner;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Boolean getClientVisible() {
        return clientVisible;
    }

    public void setClientVisible(Boolean clientVisible) {
        this.clientVisible = clientVisible;
    }
}
