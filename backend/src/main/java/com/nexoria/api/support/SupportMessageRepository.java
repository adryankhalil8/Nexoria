package com.nexoria.api.support;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {
    List<SupportMessage> findAllByOrderByCreatedAtDesc();
    List<SupportMessage> findAllByClientEmailIgnoreCaseOrderByCreatedAtAsc(String clientEmail);
    List<SupportMessage> findAllByClientUserId(Long clientUserId);
    void deleteAllByClientEmailIgnoreCase(String clientEmail);
}
