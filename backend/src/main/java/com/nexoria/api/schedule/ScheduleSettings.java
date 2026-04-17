package com.nexoria.api.schedule;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "schedule_settings")
public class ScheduleSettings {
    public static final long SINGLETON_ID = 1L;

    @Id
    private Long id = SINGLETON_ID;

    @Column(nullable = false)
    private String timezone = "America/New_York";

    @Column(nullable = false)
    private int slotDurationMinutes = 45;

    @Column(nullable = false)
    private int bookingHorizonDays = 21;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
