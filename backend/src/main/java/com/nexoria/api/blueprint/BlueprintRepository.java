package com.nexoria.api.blueprint;

import com.nexoria.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlueprintRepository extends JpaRepository<Blueprint, Long> {
    List<Blueprint> findByUser(User user);
    List<Blueprint> findByClientEmailIgnoreCase(String clientEmail);
    List<Blueprint> findByUserOrClientEmailIgnoreCase(User user, String clientEmail);
    Optional<Blueprint> findByIdAndUser(Long id, User user);
    Optional<Blueprint> findByIdAndClientEmailIgnoreCase(Long id, String clientEmail);
}

