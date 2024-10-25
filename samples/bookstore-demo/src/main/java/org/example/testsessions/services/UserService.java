package org.example.testsessions.services;

import org.example.testsessions.models.Cart;
import org.example.testsessions.models.User;
import org.example.testsessions.dtos.CreateUserDto;
import org.example.testsessions.repositories.CartRepository;
import org.example.testsessions.repositories.CategoryRepository;
import org.example.testsessions.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Optional<User> getUser(String username, String password){
        User candidateUser = userRepository.findByUsername(username);
        if(candidateUser != null && passwordEncoder.matches(password, candidateUser.getPassword())){
            return Optional.of(candidateUser);
        }

        return Optional.empty();
    }

    public User createUser(CreateUserDto createUserDto) throws DataIntegrityViolationException{
        String encodedPassword = passwordEncoder.encode(createUserDto.getPassword());
        Cart cart = new Cart();
        User newUser = new User(createUserDto, encodedPassword, cart);
        cartRepository.save(cart);
        return userRepository.save(newUser);
    }
}
