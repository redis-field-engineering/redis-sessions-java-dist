package org.example.testsessions.models;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Data
@Entity
@Table(name = "cart")
public class Cart implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;


    @OneToOne(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private User user;

    @ManyToMany(fetch = FetchType.EAGER)
    private Map<String,Book> books;

    public void addBook (Book book){
        books.put(book.getId(), book);
    }

    public void removeBook(String id){
        books.remove(id);
    }

    @Transient
    public Double getTotalPrice(){
        if(books == null){
            return 0.0;
        }

        return books.values().stream().mapToDouble(Book::getPrice).sum();
    }

    public Cart(User user){
        books = new HashMap<>();
        this.user = user;
    }

    public Cart(){
        books = new HashMap<>();
    }
}
