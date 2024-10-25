package org.example.testsessions.controllers;

import org.example.testsessions.models.Book;
import org.example.testsessions.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class BooksController {

    @Autowired
    private BookRepository bookRepository;


    @GetMapping("/books/all")
    public ResponseEntity<Map<String, Object>> all(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer pageSize){
        Pageable paging = PageRequest.of(page, pageSize);
        Page<Book> pageResult = bookRepository.findAll(paging);
        List<Book> books = pageResult.hasContent() ? pageResult.getContent() : Collections.emptyList();
        Map<String, Object> response = new HashMap<>();
        response.put("books", books);
        response.put("page", pageResult.getNumber());
        response.put("pages", pageResult.getTotalPages());
        response.put("total", pageResult.getTotalElements());

        return ResponseEntity.ok(response);
    }
}
