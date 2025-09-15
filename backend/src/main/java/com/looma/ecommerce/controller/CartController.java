package com.looma.ecommerce.controller;

import com.looma.ecommerce.dto.CartItemDTO;
import com.looma.ecommerce.dto.UpdateCartItemRequestDTO;
import com.looma.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCartItems(@AuthenticationPrincipal UserDetails userDetails) {
        List<CartItemDTO> cartItems = cartService.getCartItems(userDetails.getUsername());
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/items")
    public ResponseEntity<Void> addItemToCart(@AuthenticationPrincipal UserDetails userDetails, @RequestParam String productId, @RequestParam(defaultValue = "1") int quantity) {
        cartService.addItemToCart(userDetails.getUsername(), productId, quantity);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<Void> updateCartItem(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String productId, @Valid @RequestBody UpdateCartItemRequestDTO request) {
        cartService.updateCartItem(userDetails.getUsername(), productId, request.getQuantity());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeCartItem(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String productId) {
        cartService.removeCartItem(userDetails.getUsername(), productId);
        return ResponseEntity.ok().build();
    }
}