package com.nexoria.api.support;

public class SupportMessageResponse {
    private Long id;
    private String clientEmail;
    private String businessName;
    private String sender;
    private String body;
    private String createdAt;

    public static SupportMessageResponse from(SupportMessage message) {
        SupportMessageResponse response = new SupportMessageResponse();
        response.setId(message.getId());
        response.setClientEmail(message.getClientEmail());
        response.setBusinessName(message.getBusinessName());
        response.setSender(message.getSender().name());
        response.setBody(message.getBody());
        response.setCreatedAt(message.getCreatedAt().toString());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
