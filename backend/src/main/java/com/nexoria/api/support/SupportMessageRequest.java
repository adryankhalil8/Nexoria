package com.nexoria.api.support;

import jakarta.validation.constraints.NotBlank;

public class SupportMessageRequest {
    @NotBlank
    private String body;

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
