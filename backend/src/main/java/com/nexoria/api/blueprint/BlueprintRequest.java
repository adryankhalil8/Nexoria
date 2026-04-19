package com.nexoria.api.blueprint;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "BlueprintRequest", description = "Payload used to generate or update a blueprint.")
public class BlueprintRequest {

    @NotBlank
    @Schema(example = "https://example.com")
    private String url;

    @NotBlank
    @Schema(example = "Technology")
    private String industry;

    @NotBlank
    @Schema(example = "$50k-$200k/mo")
    private String revenueRange;

    @Schema(example = "client@example.com")
    private String clientEmail;

    @NotNull
    @Schema(example = "[\"Increase qualified leads\", \"Improve SEO\"]")
    private List<String> goals;

    private ExternalSignal externalSignal;

    @Schema(example = "APPROVED")
    private BlueprintStatus status;

    @Schema(example = "BOOKED_JOB")
    private PurchaseEventType purchaseEventType;

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

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
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

    public BlueprintStatus getStatus() {
        return status;
    }

    public void setStatus(BlueprintStatus status) {
        this.status = status;
    }

    public PurchaseEventType getPurchaseEventType() {
        return purchaseEventType;
    }

    public void setPurchaseEventType(PurchaseEventType purchaseEventType) {
        this.purchaseEventType = purchaseEventType;
    }
}
