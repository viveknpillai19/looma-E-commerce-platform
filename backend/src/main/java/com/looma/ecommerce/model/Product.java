package com.looma.ecommerce.model;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;

    private String description;

    private BigDecimal price;

    private String category;

    private int stockQuantity;

    // A flexible map to hold product-specific attributes (e.g., RAM, color, size).
    private Map<String, Object> attributes;
}