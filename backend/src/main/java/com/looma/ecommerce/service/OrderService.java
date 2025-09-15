package com.looma.ecommerce.service;

import com.looma.ecommerce.model.*;
import com.looma.ecommerce.repository.CartRepository;
import com.looma.ecommerce.repository.OrderRepository;
import com.looma.ecommerce.repository.ProductRepository;
import com.looma.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional // This annotation makes the entire method a single database transaction.
    public Order createOrder(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create an order with an empty cart");
        }

        Order newOrder = new Order();
        newOrder.setUser(user);
        newOrder.setOrderDate(LocalDateTime.now());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            // Use the new locking method to fetch the product
            Product product = productRepository.findByIdForUpdate(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found in catalog"));

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Decrement stock in MongoDB
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            // Create a new OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(newOrder);
            orderItem.setProductId(product.getId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());

            newOrder.getItems().add(orderItem);
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        newOrder.setTotalAmount(totalAmount);

        // Clear the user's cart
        cart.getItems().clear();
        cartRepository.save(cart);

        // Save the complete order
        return orderRepository.save(newOrder);
    }

    public List<Order> getOrderHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }
}