package com.nexoria.api.schedule;

public class AvailabilityWindowResponse {
    private Long id;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private boolean active;

    public static AvailabilityWindowResponse from(AvailabilityWindow window) {
        AvailabilityWindowResponse response = new AvailabilityWindowResponse();
        response.setId(window.getId());
        response.setDayOfWeek(window.getDayOfWeek().name());
        response.setStartTime(window.getStartTime().toString());
        response.setEndTime(window.getEndTime().toString());
        response.setActive(window.isActive());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
