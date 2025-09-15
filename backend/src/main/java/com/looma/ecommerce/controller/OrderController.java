package com.looma.ecommerce.controller;

import com.looma.ecommerce.model.Order;
import com.looma.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.createOrder(userDetails.getUsername());
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrderHistory(@AuthenticationPrincipal UserDetails userDetails) {
        List<Order> orders = orderService.getOrderHistory(userDetails.getUsername());
        return ResponseEntity.ok(orders);
    }
}