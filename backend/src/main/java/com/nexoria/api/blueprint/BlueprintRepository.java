package com.nexoria.api.blueprint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlueprintRepository extends JpaRepository<Blueprint, Long> {
}

