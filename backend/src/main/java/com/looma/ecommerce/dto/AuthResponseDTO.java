package com.looma.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Lombok constructor for all fields
public class AuthResponseDTO {
    private String accessToken;
}
