package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "quotes")
public class Quote {
    @Id
    public String id;
    
    public String requirementId;
    public String requirementTitle;
    public String buyerId;
    public String buyer;
    public String sellerId;
    public String seller;
    public double price;
    public int deliveryDays;
    public double rating;
    public int reviews;
    public String experience;
    
    @Column(length = 2000)
    public String note;
    
    public String status;
    public String submittedAt;

    public Quote() {}
}
