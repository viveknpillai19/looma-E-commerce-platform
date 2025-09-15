package com.looma.ecommerce.dto;

import com.looma.ecommerce.model.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CartItemDTO {
    private String productId;
    private int quantity;
    private String name;
    private double price;
    private String imageUrl;
    private int stockQuantity;

    // A helper constructor to easily map from Product and quantity
    public CartItemDTO(Product product, int quantity) {
        this.productId = product.getId();
        this.name = product.getName();
        this.price = product.getPrice().doubleValue();
        this.imageUrl = product.getImageUrl();
        this.stockQuantity = product.getStockQuantity();
        this.quantity = quantity;
    }
}