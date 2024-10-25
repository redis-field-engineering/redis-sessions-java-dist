package org.example.testsessions.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserDto {
    private String username;

    private String firstName;

    private String lastName;

    private String password;

    private String email;
}
