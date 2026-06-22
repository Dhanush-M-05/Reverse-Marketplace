package com.example.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    public String id;
    
    public String name;
    
    @Column(unique = true)
    public String email;
    
    public String password;
    public String role;
    public String status;
    public boolean verified;
    public String location;
    public String joined;
    
    @Column(length = 2000)
    public String bio;
    
    // Seller specific fields
    public double rating;
    public int reviews;
    public int completed;
    public String experience;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    public List<String> skills = new ArrayList<>();

    public User() {}
}
