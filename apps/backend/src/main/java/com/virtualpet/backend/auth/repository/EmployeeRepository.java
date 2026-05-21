package com.virtualpet.backend.auth.repository;

import com.virtualpet.backend.auth.domain.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, UUID> {
    Optional<EmployeeEntity> findByLegajo(String legajo);
}
