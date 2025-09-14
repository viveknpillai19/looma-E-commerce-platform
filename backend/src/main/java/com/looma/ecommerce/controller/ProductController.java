package com.looma.ecommerce.controller;

import com.looma.ecommerce.model.Product;
import com.looma.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    private ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository)
    {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getAllProducts()
    {
        return productRepository.findAll(); // Spring will automatically convert the List of Products into JSON format.
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // In a real app, we'd use a service to save the product
        Product savedProduct = productRepository.save(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        // We find the product by its ID and return it.
        // If not found, we return a 404 Not Found status.
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
