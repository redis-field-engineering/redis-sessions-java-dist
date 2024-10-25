package org.example.testsessions.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/testSession")
    public String testSession(HttpSession session){
        String foo = (String)session.getAttribute("foo");
        if(foo == null){
            session.setAttribute("foo","bar");
        }

        return (String)session.getAttribute("foo");
    }
}
