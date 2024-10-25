package org.example.testsessions.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "book")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Book implements Serializable {
    @Id
    @EqualsAndHashCode.Include
    private String id;

    @Column(columnDefinition = "TEXT")
    private String title;
    @Column(columnDefinition = "TEXT")
    private String subtitle;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String language;
    private Long pageCount;
    private String thumbnail;
    private Double price;
    private String currency;
    private String infoLink;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> authors;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Category> categories = new HashSet<>();

    public void addCategory(Category category) {
        categories.add(category);
    }

    public Book(){
    }
}
