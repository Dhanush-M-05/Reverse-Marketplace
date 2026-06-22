package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    public String id;
    
    public String title;
    public String requirementId;
    public String seller;
    public String sellerId;
    public String buyer;
    public String buyerId;
    public double amount;
    public String status;
    public String date;
    public String eta;
    public int progress;

    public Order() {}
}
