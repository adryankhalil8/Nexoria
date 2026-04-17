package com.nexoria.api.schedule;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilityWindowRepository extends JpaRepository<AvailabilityWindow, Long> {
    List<AvailabilityWindow> findAllByOrderByDayOfWeekAscStartTimeAsc();
}
