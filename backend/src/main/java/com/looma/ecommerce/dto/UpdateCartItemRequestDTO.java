package com.looma.ecommerce.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateCartItemRequestDTO {
    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}