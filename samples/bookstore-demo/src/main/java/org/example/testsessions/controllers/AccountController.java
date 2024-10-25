package org.example.testsessions.controllers;

import jakarta.servlet.http.HttpSession;
import org.example.testsessions.Constants;
import org.example.testsessions.dtos.CreateUserDto;
import org.example.testsessions.dtos.LoginDto;
import org.example.testsessions.dtos.UserDto;
import org.example.testsessions.models.User;
import org.example.testsessions.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class AccountController {
    @Autowired
    private UserService userService;



    @GetMapping("/account/getLoggedInUser")
    public ResponseEntity<UserDto> getLoggedInUser(HttpSession session){
        UserDto user = (UserDto) session.getAttribute(Constants.USER_DTO_KEY);
        if(user != null){
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.notFound().build();
    }



    @PostMapping("/account/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginDto loginDto, HttpSession session){
        Optional<User> user = userService.getUser(loginDto.getUsername(), loginDto.getPassword());

        if(user.isEmpty()){
            return ResponseEntity.status(401).build();
        }

//        session.setAttribute(IS_LOGGED_IN_KEY, true);
        session.setAttribute(Constants.USER_DTO_KEY, new UserDto(user.get()));
        session.setAttribute(Constants.USER_NAME_KEY, user.get().getUsername());
        if(user.get().getCart() != null){
            session.setAttribute(Constants.CART_KEY, user.get().getCart());
        }

        return ResponseEntity.ok(new UserDto(user.get()));
    }

    @PostMapping("/account/createUser")
    public ResponseEntity createUser(@RequestBody CreateUserDto createUserDto){
        try {
            User createdUser = userService.createUser(createUserDto);
            return ResponseEntity.ok(new UserDto(createdUser));
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).body("Username already exists");
        }
    }
}
