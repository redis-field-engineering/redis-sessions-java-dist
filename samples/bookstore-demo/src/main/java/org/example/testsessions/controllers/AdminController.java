package org.example.testsessions.controllers;

import com.redis.sessions.RedisSession;
import com.redis.sessions.RedisSessionProvider;
import com.redis.sessions.filtering.Filter;
import com.redis.sessions.filtering.QueryBuilder;
import com.redis.sessions.spring.RedisSessionRepository;
import jakarta.servlet.http.HttpSession;
import org.example.testsessions.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@ConditionalOnProperty(name="spring.session.store-type", havingValue = "redisSessions")
public class AdminController {
    @Autowired
    private RedisSessionProvider provider;

    @Autowired
    RedisSessionRepository repository;


    @GetMapping("/admin/available")
    public ResponseEntity<Boolean> adminAvailable(){
        return ResponseEntity.ok(true);
    }

    @PostMapping("/account/logout")
    public ResponseEntity<String> logOut(HttpSession session){
        repository.deleteById(session.getId());
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/admin/getOldestSessions")
    public ResponseEntity<Map<String, Long>> getOldestSessions(){
        Filter filter = QueryBuilder.any();
        Map<String, RedisSession> sessions = provider.findSessions(filter, Constants.CREATED_AT_KEY, true, 5);
        Map<String,Long> resultMap = sessions.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, x->(Long)x.getValue().getAttribute(Constants.CREATED_AT_KEY).get()));
        return ResponseEntity.ok(resultMap);
    }

    @GetMapping("/admin/getLargestSessions")
    public ResponseEntity<Map<String,Long>> getLargestSessions(){
        return ResponseEntity.ok(provider.largestSessions(5));
    }

    @GetMapping("/admin/getUniqueSessions")
    public ResponseEntity<Long> getUniqueSessions(){
        return ResponseEntity.ok(provider.uniqueSessions());
    }

    @GetMapping("/admin/getSessionForUser")
    public ResponseEntity<String> getSessionForUser(@RequestParam String username){
        Filter filter = QueryBuilder.equals(Constants.USER_NAME_KEY, username);
        Map<String,RedisSession> sessions = provider.findSessions(filter, 1);
        Optional<Map.Entry<String, RedisSession>> session = sessions.entrySet().stream().findFirst();
        return session.map(stringSessionEntry ->
                ResponseEntity.ok(stringSessionEntry.getKey())).orElseGet(() ->
                ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/getSessionsWithinRange")
    public ResponseEntity<List<String>> getSessionsWithinCartTotalRange(@RequestParam double min, @RequestParam double max){
        Filter filter = QueryBuilder.between(Constants.CART_TOTAL_KEY, min, max);
        Map<String,RedisSession> sessions = provider.findSessions(filter, 10);
        return ResponseEntity.ok(new ArrayList<>(sessions.keySet()));
    }

    @GetMapping("/admin/getSessionsWithGivenBook")
    public ResponseEntity<List<String>> getSessionsWithGivenBook(@RequestParam String title){
        Filter filter = QueryBuilder.equals(Constants.BOOKS_IN_CART_KEY, title);
        Map<String,RedisSession> sessions = provider.findSessions(filter, 10);
        return ResponseEntity.ok(new ArrayList<>(sessions.keySet()));
    }
}
