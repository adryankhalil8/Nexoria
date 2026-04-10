package com.nexoria.api.lead;

import java.time.Instant;

public class LeadResponse {
    private Long id;
    private String company;
    private String contactName;
    private String email;
    private String website;
    private String industry;
    private String notes;
    private LeadStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    public static LeadResponse from(Lead lead) {
        LeadResponse response = new LeadResponse();
        response.setId(lead.getId());
        response.setCompany(lead.getCompany());
        response.setContactName(lead.getContactName());
        response.setEmail(lead.getEmail());
        response.setWebsite(lead.getWebsite());
        response.setIndustry(lead.getIndustry());
        response.setNotes(lead.getNotes());
        response.setStatus(lead.getStatus());
        response.setCreatedAt(lead.getCreatedAt());
        response.setUpdatedAt(lead.getUpdatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LeadStatus getStatus() {
        return status;
    }

    public void setStatus(LeadStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
