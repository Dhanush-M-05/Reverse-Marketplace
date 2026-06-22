package com.example.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "requirements")
public class Requirement {
    @Id
    public String id;
    
    public String title;
    public String category;
    public String subCategory;
    public double budget;
    public String deadline;
    public String location;
    public String priority;
    public String status;
    public String postedBy;
    public String buyerName;
    public String postedAt;
    public int quotesCount;
    
    @Column(length = 4000)
    public String description;
    
    public int images;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "requirement_images", joinColumns = @JoinColumn(name = "requirement_id"))
    @Column(name = "image_url")
    public List<String> uploadedImages = new ArrayList<>();
    
    public int aiRiskScore;

    public Requirement() {}
}
