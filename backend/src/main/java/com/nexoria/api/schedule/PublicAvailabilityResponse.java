package com.nexoria.api.schedule;

import java.util.List;

public class PublicAvailabilityResponse {
    private String timezone;
    private int slotDurationMinutes;
    private List<String> availableSlots;

    public PublicAvailabilityResponse(String timezone, int slotDurationMinutes, List<String> availableSlots) {
        this.timezone = timezone;
        this.slotDurationMinutes = slotDurationMinutes;
        this.availableSlots = availableSlots;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public int getSlotDurationMinutes() {
        return slotDurationMinutes;
    }

    public void setSlotDurationMinutes(int slotDurationMinutes) {
        this.slotDurationMinutes = slotDurationMinutes;
    }

    public List<String> getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(List<String> availableSlots) {
        this.availableSlots = availableSlots;
    }
}
