package com.nexoria.api.schedule;

public class ScheduledCallResponse {
    private Long id;
    private Long leadId;
    private String source;
    private String status;
    private String company;
    private String contactName;
    private String email;
    private String website;
    private String industry;
    private String notes;
    private String scheduledStart;
    private String scheduledEnd;
    private String timezone;
    private String createdAt;

    public static ScheduledCallResponse from(ScheduledCall call) {
        ScheduledCallResponse response = new ScheduledCallResponse();
        response.setId(call.getId());
        response.setLeadId(call.getLead() == null ? null : call.getLead().getId());
        response.setSource(call.getSource().name());
        response.setStatus(call.getStatus().name());
        response.setCompany(call.getCompany());
        response.setContactName(call.getContactName());
        response.setEmail(call.getEmail());
        response.setWebsite(call.getWebsite());
        response.setIndustry(call.getIndustry());
        response.setNotes(call.getNotes());
        response.setScheduledStart(call.getScheduledStart().toString());
        response.setScheduledEnd(call.getScheduledEnd().toString());
        response.setTimezone(call.getTimezone());
        response.setCreatedAt(call.getCreatedAt().toString());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getScheduledStart() {
        return scheduledStart;
    }

    public void setScheduledStart(String scheduledStart) {
        this.scheduledStart = scheduledStart;
    }

    public String getScheduledEnd() {
        return scheduledEnd;
    }

    public void setScheduledEnd(String scheduledEnd) {
        this.scheduledEnd = scheduledEnd;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
