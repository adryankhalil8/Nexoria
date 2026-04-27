package com.nexoria.api.schedule;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface ScheduledCallRepository extends JpaRepository<ScheduledCall, Long> {
    List<ScheduledCall> findAllByStatusAndScheduledEndAfterOrderByScheduledStartAsc(ScheduledCallStatus status, Instant scheduledEnd);
    List<ScheduledCall> findAllByOrderByScheduledStartAsc();
    List<ScheduledCall> findAllByLeadId(Long leadId);
    List<ScheduledCall> findAllByLeadUserEmailIgnoreCaseOrderByScheduledStartAsc(String email);
    boolean existsByEmailIgnoreCaseAndStatus(String email, ScheduledCallStatus status);
}
