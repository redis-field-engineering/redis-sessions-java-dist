package org.example.testsessions.controllers;


import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@ConditionalOnProperty(name="spring.session.store-type", havingValue = "redis")
public class AdminControllerSimple {
    @GetMapping("/admin/available")
    public ResponseEntity<Boolean> adminAvailable(){
        return ResponseEntity.ok(false);
    }
}
