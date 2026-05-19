package com.virtualpet.backend.catalog.service;

import com.virtualpet.backend.catalog.domain.ProductEntity;
import com.virtualpet.backend.catalog.domain.ProductSort;
import com.virtualpet.backend.catalog.domain.ProductVariantEntity;
import com.virtualpet.backend.catalog.dto.CatalogDtos.CatalogFacetsResponse;
import com.virtualpet.backend.catalog.dto.CatalogDtos.CategoryResponse;
import com.virtualpet.backend.catalog.dto.CatalogDtos.FacetOption;
import com.virtualpet.backend.catalog.dto.CatalogDtos.ProductDetailResponse;
import com.virtualpet.backend.catalog.dto.CatalogDtos.ProductPageResponse;
import com.virtualpet.backend.catalog.dto.CatalogDtos.ProductSummaryResponse;
import com.virtualpet.backend.catalog.dto.CatalogDtos.VariantBySkuResponse;
import com.virtualpet.backend.catalog.dto.CatalogDtos.VariantResponse;
import com.virtualpet.backend.catalog.repository.CategoryRepository;
import com.virtualpet.backend.catalog.repository.ProductRepository;
import com.virtualpet.backend.catalog.repository.ProductVariantRepository;
import com.virtualpet.backend.catalog.spec.ProductSpecifications;
import com.virtualpet.backend.shared.exception.ApiException;
import jakarta.persistence.criteria.JoinType;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public ProductPageResponse list(
            String q,
            String category,
            String petType,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            int page,
            int size) {
        Specification<ProductEntity> spec = ProductSpecifications.active()
                .and(ProductSpecifications.search(q))
                .and(ProductSpecifications.categorySlug(category))
                .and(ProductSpecifications.petType(petType))
                .and(ProductSpecifications.brand(brand))
                .and(ProductSpecifications.priceRange(minPrice, maxPrice));

        Page<ProductEntity> result = productRepository.findAll(
                spec, PageRequest.of(page, size, ProductSort.fromParam(sort).toSort()));

        List<ProductSummaryResponse> items =
                result.getContent().stream().map(this::toSummary).toList();
        return new ProductPageResponse(items, result.getTotalElements(), page, size);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listCategories() {
        return categoryRepository.findAllWithProductCounts().stream()
                .map(row -> new CategoryResponse(
                        ((UUID) row[0]).toString(),
                        (String) row[1],
                        (String) row[2],
                        (Long) row[3]))
                .toList();
    }

    @Transactional(readOnly = true)
    public CatalogFacetsResponse getFacets() {
        List<FacetOption> petTypes = productRepository.countActiveByPetType().stream()
                .map(row -> new FacetOption(
                        (String) row[0], labelPetType((String) row[0]), (Long) row[1]))
                .toList();
        List<CategoryResponse> categories = listCategories();
        List<FacetOption> brands = productRepository.countActiveByBrand().stream()
                .map(row -> new FacetOption((String) row[0], (String) row[0], (Long) row[1]))
                .toList();
        return new CatalogFacetsResponse(petTypes, categories, brands);
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getById(UUID id) {
        return toDetail(loadProduct(id));
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getBySlug(String slug) {
        ProductEntity product = productRepository
                .findBySlugIgnoreCaseAndActiveTrue(slug)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        return toDetail(loadProduct(product.getId()));
    }

    @Transactional(readOnly = true)
    public VariantBySkuResponse getVariantBySku(String sku) {
        ProductVariantEntity variant = variantRepository
                .findBySkuWithProduct(sku)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SKU no encontrado"));
        ProductEntity product = variant.getProduct();
        return new VariantBySkuResponse(
                toVariant(variant),
                product.getId().toString(),
                product.getSlug(),
                product.getName(),
                product.getCategory().getSlug(),
                product.getPetType(),
                product.getBrand());
    }

    @Transactional(readOnly = true)
    public ProductVariantEntity getVariant(UUID variantId) {
        return variantRepository
                .findByIdWithProduct(variantId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Variante no encontrada"));
    }

    private ProductEntity loadProduct(UUID id) {
        Specification<ProductEntity> spec = (root, query, cb) -> {
            query.distinct(true);
            root.fetch("category", JoinType.LEFT);
            root.fetch("variants", JoinType.LEFT);
            return cb.and(cb.equal(root.get("id"), id), cb.isTrue(root.get("active")));
        };
        return productRepository.findAll(spec).stream()
                .findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    private ProductSummaryResponse toSummary(ProductEntity product) {
        List<ProductVariantEntity> variants = variantRepository.findByProductId(product.getId());
        BigDecimal minPrice = variants.stream()
                .map(ProductVariantEntity::unitPrice)
                .min(Comparator.naturalOrder())
                .orElse(product.getBasePrice());
        String image = variants.stream()
                .map(ProductVariantEntity::getImageUrl)
                .filter(url -> url != null && !url.isBlank())
                .findFirst()
                .orElse(null);
        return new ProductSummaryResponse(
                product.getId().toString(),
                product.getSlug(),
                product.getName(),
                product.getDescription(),
                product.getBasePrice(),
                product.getCategory().getName(),
                product.getCategory().getSlug(),
                product.getPetType(),
                product.getBrand(),
                image,
                minPrice);
    }

    private ProductDetailResponse toDetail(ProductEntity product) {
        List<VariantResponse> variants =
                product.getVariants().stream().map(this::toVariant).toList();
        return new ProductDetailResponse(
                product.getId().toString(),
                product.getSlug(),
                product.getName(),
                product.getDescription(),
                product.getBasePrice(),
                product.getCategory().getName(),
                product.getCategory().getSlug(),
                product.getPetType(),
                product.getBrand(),
                variants);
    }

    private VariantResponse toVariant(ProductVariantEntity v) {
        return new VariantResponse(
                v.getId().toString(),
                v.getSku(),
                v.getAttributes(),
                v.unitPrice(),
                v.getStock(),
                v.getImageUrl());
    }

    private static String labelPetType(String petType) {
        return switch (petType.toLowerCase(Locale.ROOT)) {
            case "perro" -> "Perro";
            case "gato" -> "Gato";
            case "ave" -> "Ave";
            case "pez" -> "Pez";
            default -> petType.substring(0, 1).toUpperCase(Locale.ROOT) + petType.substring(1);
        };
    }
}
