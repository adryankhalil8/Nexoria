package com.nexoria.api.schedule;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateBookingRequest {
    @NotBlank
    private String company;

    @NotBlank
    private String contactName;

    @Email
    @NotBlank
    private String email;

    private String website;
    private String industry;
    private String revenueRange;
    private List<String> goals;
    private String notes;

    @NotBlank
    private String scheduledStart;

    @NotBlank
    private String source;

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getScheduledStart() {
        return scheduledStart;
    }

    public void setScheduledStart(String scheduledStart) {
        this.scheduledStart = scheduledStart;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
