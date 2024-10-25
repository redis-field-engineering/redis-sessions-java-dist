package org.example.testsessions.repositories;

import org.example.testsessions.models.Cart;
import org.springframework.data.repository.CrudRepository;

public interface CartRepository extends CrudRepository<Cart, Long> {
}
