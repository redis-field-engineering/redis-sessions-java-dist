package org.example.testsessions.dtos;

import lombok.Getter;
import lombok.Setter;
import org.example.testsessions.models.Cart;
import org.example.testsessions.models.User;

import java.io.Serializable;

@Getter
@Setter
public class UserDto implements Serializable {
    private String firstName;
    private String lastName;
    private String username;
    private Long id;
    private Cart cartDto;

    public UserDto(User user){
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
        this.cartDto = user.getCart();
        this.id = user.getId();
    }
}
