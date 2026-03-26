package com.nexoria.api.blueprint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class BlueprintRequest {

    @NotBlank
    private String url;

    @NotBlank
    private String industry;

    @NotBlank
    private String revenueRange;

    @NotNull
    private List<String> goals;

    private ExternalSignal externalSignal;

    // Getters and Setters
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getRevenueRange() {
        return revenueRange;
    }

    public void setRevenueRange(String revenueRange) {
        this.revenueRange = revenueRange;
    }

    public List<String> getGoals() {
        return goals;
    }

    public void setGoals(List<String> goals) {
        this.goals = goals;
    }

    public ExternalSignal getExternalSignal() {
        return externalSignal;
    }

    public void setExternalSignal(ExternalSignal externalSignal) {
        this.externalSignal = externalSignal;
    }
}
