package org.example.testsessions.controllers;

import jakarta.servlet.http.HttpSession;
import org.example.testsessions.Constants;
import org.example.testsessions.dtos.UserDto;
import org.example.testsessions.models.Book;
import org.example.testsessions.models.Cart;
import org.example.testsessions.models.User;
import org.example.testsessions.repositories.CartRepository;
import org.example.testsessions.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class CartController {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/cart")
    public ResponseEntity<Cart> addToCart(@RequestBody Book book, HttpSession session){
        Optional<Cart> optionalCart = materializeCart(session);
        if(optionalCart.isEmpty()){
            return ResponseEntity.status(401).build();
        }

        Cart cart = optionalCart.get();
        cart.addBook(book);
        updateCart(session, cart);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/cart")
    public ResponseEntity<Cart> getCart(HttpSession session){
        Optional<Cart> cart = materializeCart(session);
        return cart.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }

    @GetMapping("/cart/numItems")
    public ResponseEntity<Integer> getNumItems(HttpSession session){
        Optional<Cart> cart = materializeCart(session);
        return cart.map(value -> ResponseEntity.ok(value.getBooks().size())).orElseGet(() -> ResponseEntity.status(401).build());

    }

    @DeleteMapping("/cart/{bookId}")
    public ResponseEntity<Cart> removeItem(@PathVariable String bookId, HttpSession session){
        Cart cart = (Cart)session.getAttribute(Constants.CART_KEY);
        if(cart == null){
            Optional<Cart> newCart = getNewCart(session);
            if(newCart.isEmpty()){
                return ResponseEntity.status(401).build();
            }

            cart = newCart.get();
        }

        cart.removeBook(bookId);
        updateCart(session,cart);
        return ResponseEntity.ok(cart);
    }

    private Optional<Cart> materializeCart(HttpSession session){
        Cart cart = (Cart)session.getAttribute(Constants.CART_KEY);
        if (cart == null) {
            UserDto userDto = (UserDto)session.getAttribute(Constants.USER_DTO_KEY);
            if (userDto != null) {
                Optional<User> user = userRepository.findById(userDto.getId());
                if(user.isPresent() && user.get().getCart() != null){
                    return Optional.of(user.get().getCart());
                }
            }
            Optional<Cart> newCart = getNewCart(session);
            return newCart;
        }

        return Optional.of(cart);
    }

    private Optional<Cart> getNewCart(HttpSession session){
        UserDto userDto = (UserDto)session.getAttribute(Constants.USER_DTO_KEY);
        if(userDto == null) {
            return Optional.empty();
        }

        return userRepository.findById(userDto.getId()).map(Cart::new);
    }

    private void updateCart(HttpSession session, Cart cart){
        session.setAttribute(Constants.CART_KEY, cart);
        cartRepository.save(cart);

        String booksInCart = String.join("|", cart.getBooks().values().stream().map(Book::getTitle).toList());
        if(booksInCart.isEmpty()){
            session.removeAttribute(Constants.BOOKS_IN_CART_KEY);
        } else{
            session.setAttribute(Constants.BOOKS_IN_CART_KEY, booksInCart);
        }

        session.setAttribute(Constants.CART_TOTAL_KEY, cart.getTotalPrice());
    }
}
