package com.nexoria.api.schedule;

import java.util.List;

public class ScheduleSettingsResponse {
    private String timezone;
    private int slotDurationMinutes;
    private int bookingHorizonDays;
    private List<AvailabilityWindowResponse> availabilityWindows;

    public static ScheduleSettingsResponse from(ScheduleSettings settings, List<AvailabilityWindow> windows) {
        ScheduleSettingsResponse response = new ScheduleSettingsResponse();
        response.setTimezone(settings.getTimezone());
        response.setSlotDurationMinutes(settings.getSlotDurationMinutes());
        response.setBookingHorizonDays(settings.getBookingHorizonDays());
        response.setAvailabilityWindows(windows.stream().map(AvailabilityWindowResponse::from).toList());
        return response;
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

    public int getBookingHorizonDays() {
        return bookingHorizonDays;
    }

    public void setBookingHorizonDays(int bookingHorizonDays) {
        this.bookingHorizonDays = bookingHorizonDays;
    }

    public List<AvailabilityWindowResponse> getAvailabilityWindows() {
        return availabilityWindows;
    }

    public void setAvailabilityWindows(List<AvailabilityWindowResponse> availabilityWindows) {
        this.availabilityWindows = availabilityWindows;
    }
}
