package com.looma.ecommerce.service;

import com.looma.ecommerce.dto.CartItemDTO;
import com.looma.ecommerce.model.Cart;
import com.looma.ecommerce.model.CartItem;
import com.looma.ecommerce.model.Product;
import com.looma.ecommerce.model.User;
import com.looma.ecommerce.repository.CartRepository;
import com.looma.ecommerce.repository.ProductRepository;
import com.looma.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<CartItemDTO> getCartItems(String userEmail) {
        User user = findUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        return cart.getItems().stream()
                .map(this::mapToCartItemDTO)
                .collect(Collectors.toList());
    }

    public void addItemToCart(String userEmail, String productId, int quantity) {
        User user = findUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        // Validate that the product exists
        productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProductId(productId);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }
        cartRepository.save(cart);
    }

    public void updateCartItem(String userEmail, String productId, int quantity) {
        User user = findUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem item = findCartItem(cart, productId);
        item.setQuantity(quantity);
        cartRepository.save(cart);
    }

    public void removeCartItem(String userEmail, String productId) {
        User user = findUserByEmail(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem item = findCartItem(cart, productId);
        cart.getItems().remove(item);
        cartRepository.save(cart);
    }

    // Helper methods
    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private CartItem findCartItem(Cart cart, String productId) {
        return cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));
    }

    private CartItemDTO mapToCartItemDTO(CartItem cartItem) {
        Product product = productRepository.findById(cartItem.getProductId())
                .orElseThrow(() -> new RuntimeException("Product details not found for item in cart"));
        return new CartItemDTO(product, cartItem.getQuantity());
    }
}