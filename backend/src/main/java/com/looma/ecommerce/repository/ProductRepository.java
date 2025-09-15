package com.looma.ecommerce.repository;

import com.looma.ecommerce.model.Product;
import jakarta.persistence.LockModeType; // Import
import org.springframework.data.jpa.repository.Lock; // Import
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query; // Import

import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    // This custom query method will lock the product document during a read
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("{'_id': ?0}")
    Optional<Product> findByIdForUpdate(String id);
}