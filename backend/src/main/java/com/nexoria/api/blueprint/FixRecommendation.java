package com.nexoria.api.blueprint;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Embeddable;

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

    public FixRecommendation() {}

    public FixRecommendation(String title, String impact, String effort, String why) {
        this.title = title;
        this.impact = impact;
        this.effort = effort;
        this.why = why;
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
}
