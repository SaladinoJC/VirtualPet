package com.virtualpet.backend.catalog.repository;

import com.virtualpet.backend.catalog.domain.ProductEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<ProductEntity, UUID>, JpaSpecificationExecutor<ProductEntity> {

    Optional<ProductEntity> findBySlugIgnoreCaseAndActiveTrue(String slug);

    @Query(
            "SELECT p.petType, COUNT(p) FROM ProductEntity p WHERE p.active = true GROUP BY p.petType ORDER BY p.petType")
    List<Object[]> countActiveByPetType();

    @Query("SELECT p.brand, COUNT(p) FROM ProductEntity p WHERE p.active = true GROUP BY p.brand ORDER BY p.brand")
    List<Object[]> countActiveByBrand();
}
