package com.looma.ecommerce.controller;

import com.looma.ecommerce.model.Product;
import com.looma.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
