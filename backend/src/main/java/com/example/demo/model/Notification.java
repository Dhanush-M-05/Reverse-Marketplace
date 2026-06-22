package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    public String id;
    
    public String time;
    public String date;
    public boolean read;
    public String title;
    
    @Column(length = 2000)
    public String text;
    
    public String type;
    public String link;

    public Notification() {}
}
