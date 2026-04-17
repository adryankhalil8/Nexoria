package com.nexoria.api.schedule;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class ScheduleSettingsRequest {
    @NotBlank
    private String timezone;

    @Min(15)
    private int slotDurationMinutes;

    @Min(1)
    private int bookingHorizonDays;

    @Valid
    @NotEmpty
    private List<AvailabilityWindowRequest> availabilityWindows;

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

    public int getBookingHorizonDays() {
        return bookingHorizonDays;
    }

    public void setBookingHorizonDays(int bookingHorizonDays) {
        this.bookingHorizonDays = bookingHorizonDays;
    }

    public List<AvailabilityWindowRequest> getAvailabilityWindows() {
        return availabilityWindows;
    }

    public void setAvailabilityWindows(List<AvailabilityWindowRequest> availabilityWindows) {
        this.availabilityWindows = availabilityWindows;
    }
}
