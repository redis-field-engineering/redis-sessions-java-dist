package org.example.testsessions.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.testsessions.dtos.CreateUserDto;

import java.io.Serializable;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String firstName;

    private String lastName;

    @JsonIgnore
    private String password;

    private String email;

    @OneToOne
    @JoinColumn(name="cart_id", nullable = false)
    @JsonIgnore
    private Cart cart;

    public User(){
    }

    public User(CreateUserDto dto, String encodedPassword, Cart cart){
        this.username = dto.getUsername();
        this.firstName = dto.getFirstName();
        this.lastName = dto.getLastName();
        this.password = encodedPassword;
        this.email = dto.getEmail();
        this.cart = cart;
    }

}
