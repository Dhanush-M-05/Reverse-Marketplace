package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    public String id;
    
    public String date;
    public int helpful;
    public String author;
    public String target;
    public int rating;
    
    @Column(length = 2000)
    public String text;

    public Review() {}
}
