package com.nexoria.api.blueprint;

import jakarta.persistence.Embeddable;

@Embeddable
public class FixRecommendation {
    private String title;
    private String impact;
    private String effort;
    private String why;

    public FixRecommendation() {}

    public FixRecommendation(String title, String impact, String effort, String why) {
        this.title = title;
        this.impact = impact;
        this.effort = effort;
        this.why = why;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getImpact() { return impact; }
    public void setImpact(String impact) { this.impact = impact; }
    public String getEffort() { return effort; }
    public void setEffort(String effort) { this.effort = effort; }
    public String getWhy() { return why; }
    public void setWhy(String why) { this.why = why; }
}
