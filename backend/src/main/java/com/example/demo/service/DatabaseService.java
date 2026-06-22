package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.ArrayList;

@Service
public class DatabaseService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequirementRepository requirementRepository;

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostConstruct
    public void init() {
        // Prepopulate database if users are empty
        if (userRepository.count() == 0) {
            // 1. POPULATE DEMO USERS
            User buyer = new User();
            buyer.id = "demo-buyer";
            buyer.name = "Demo Buyer";
            buyer.email = "buyer@demo.com";
            buyer.password = "demo123";
            buyer.role = "buyer";
            buyer.status = "active";
            buyer.verified = true;
            buyer.location = "India";
            buyer.joined = "2026-06-15";
            buyer.bio = "Just joined Reverse Marketplace.";
            userRepository.save(buyer);

            User seller = new User();
            seller.id = "demo-seller";
            seller.name = "Demo Seller";
            seller.email = "seller@demo.com";
            seller.password = "demo123";
            seller.role = "seller";
            seller.status = "active";
            seller.verified = true;
            seller.location = "India";
            seller.joined = "2026-06-15";
            seller.bio = "Premium seller on Reverse Marketplace.";
            seller.rating = 4.8;
            seller.reviews = 12;
            seller.completed = 25;
            seller.experience = "3+ Years";
            seller.skills = Arrays.asList("Web Design", "React Development", "UI/UX Design");
            userRepository.save(seller);

            User admin = new User();
            admin.id = "demo-admin";
            admin.name = "Demo Admin";
            admin.email = "admin@demo.com";
            admin.password = "demo123";
            admin.role = "admin";
            admin.status = "active";
            admin.verified = true;
            admin.location = "India";
            admin.joined = "2026-06-15";
            admin.bio = "System Administrator.";
            userRepository.save(admin);

            User google = new User();
            google.id = "google-user";
            google.name = "Google User";
            google.email = "google.com";
            google.password = "demo123";
            google.role = "buyer";
            google.status = "active";
            google.verified = true;
            google.location = "India";
            google.joined = "2026-06-15";
            google.bio = "Logged in via Google.";
            userRepository.save(google);

            User facebook = new User();
            facebook.id = "facebook-user";
            facebook.name = "Facebook User";
            facebook.email = "facebook.com";
            facebook.password = "demo123";
            facebook.role = "seller";
            facebook.status = "active";
            facebook.verified = true;
            facebook.location = "India";
            facebook.joined = "2026-06-15";
            facebook.bio = "Logged in via Facebook.";
            facebook.rating = 4.5;
            facebook.reviews = 5;
            facebook.completed = 10;
            facebook.experience = "1 Year";
            facebook.skills = Arrays.asList("HTML/CSS", "Javascript");
            userRepository.save(facebook);

            User apple = new User();
            apple.id = "apple-user";
            apple.name = "Apple User";
            apple.email = "apple.com";
            apple.password = "demo123";
            apple.role = "buyer";
            apple.status = "active";
            apple.verified = true;
            apple.location = "India";
            apple.joined = "2026-06-15";
            apple.bio = "Logged in via Apple.";
            userRepository.save(apple);

            // Add a pending seller for Admin approval view
            User pendingSeller = new User();
            pendingSeller.id = "demo-pending-seller";
            pendingSeller.name = "Rajesh Kumar";
            pendingSeller.email = "rajesh@demo.com";
            pendingSeller.password = "demo123";
            pendingSeller.role = "seller";
            pendingSeller.status = "pending";
            pendingSeller.verified = false;
            pendingSeller.location = "Chennai, India";
            pendingSeller.joined = "2026-06-16";
            pendingSeller.bio = "UI/UX Designer with 2 years of experience.";
            pendingSeller.rating = 0.0;
            pendingSeller.reviews = 0;
            pendingSeller.completed = 0;
            pendingSeller.experience = "2 Years";
            pendingSeller.skills = Arrays.asList("UI/UX Design", "Figma", "Logo Design");
            userRepository.save(pendingSeller);

            // 2. POPULATE DUMMY REQUIREMENTS
            Requirement r1 = new Requirement();
            r1.id = "REQ-1718521000000";
            r1.title = "Need Custom React Website for E-commerce";
            r1.category = "development";
            r1.subCategory = "Web Development";
            r1.budget = 45000;
            r1.deadline = "2026-07-20";
            r1.location = "Remote";
            r1.priority = "high";
            r1.status = "open";
            r1.postedBy = "demo-buyer";
            r1.buyerName = "Demo Buyer";
            r1.postedAt = "2026-06-16";
            r1.quotesCount = 2;
            r1.description = "Looking for a React developer to build a clean, modern e-commerce UI with dynamic animations. Must use Context API and Framer Motion.";
            r1.images = 0;
            r1.uploadedImages = new ArrayList<>();
            r1.aiRiskScore = 8;
            requirementRepository.save(r1);

            Requirement r2 = new Requirement();
            r2.id = "REQ-1718520000000";
            r2.title = "Logo & Brand Design for Coffee Shop";
            r2.category = "design";
            r2.subCategory = "Branding";
            r2.budget = 12000;
            r2.deadline = "2026-07-05";
            r2.location = "Chennai";
            r2.priority = "medium";
            r2.status = "open";
            r2.postedBy = "demo-buyer";
            r2.buyerName = "Demo Buyer";
            r2.postedAt = "2026-06-15";
            r2.quotesCount = 1;
            r2.description = "Need a premium minimalist logo design and branding guidelines for our upcoming boutique coffee shop 'Aura Brew'.";
            r2.images = 0;
            r2.uploadedImages = new ArrayList<>();
            r2.aiRiskScore = 5;
            requirementRepository.save(r2);

            Requirement r3 = new Requirement();
            r3.id = "REQ-1718519000000";
            r3.title = "Gaming PC Build Assembly";
            r3.category = "electronics";
            r3.subCategory = "Hardware";
            r3.budget = 65000;
            r3.deadline = "2026-06-30";
            r3.location = "India";
            r3.priority = "medium";
            r3.status = "in_progress";
            r3.postedBy = "apple-user";
            r3.buyerName = "Apple User";
            r3.postedAt = "2026-06-14";
            r3.quotesCount = 1;
            r3.description = "Need assistance gathering components and building a high-end RTX 4070 gaming rig in Bangalore.";
            r3.images = 0;
            r3.uploadedImages = new ArrayList<>();
            r3.aiRiskScore = 12;
            requirementRepository.save(r3);

            Requirement r4 = new Requirement();
            r4.id = "REQ-1718518000000";
            r4.title = "SEO Optimization for Blog";
            r4.category = "marketing";
            r4.subCategory = "SEO";
            r4.budget = 15000;
            r4.deadline = "2026-07-10";
            r4.location = "Remote";
            r4.priority = "medium";
            r4.status = "in_progress";
            r4.postedBy = "demo-buyer";
            r4.buyerName = "Demo Buyer";
            r4.postedAt = "2026-06-13";
            r4.quotesCount = 1;
            r4.description = "We need organic traffic boost for our new tech blog. Looking for keyword analysis and content structuring.";
            r4.images = 0;
            r4.uploadedImages = new ArrayList<>();
            r4.aiRiskScore = 4;
            requirementRepository.save(r4);

            Requirement r5 = new Requirement();
            r5.id = "REQ-1718517000000";
            r5.title = "Content Writing for Tech Portal";
            r5.category = "writing";
            r5.subCategory = "Copywriting";
            r5.budget = 8000;
            r5.deadline = "2026-06-16";
            r5.location = "Remote";
            r5.priority = "low";
            r5.status = "completed";
            r5.postedBy = "demo-buyer";
            r5.buyerName = "Demo Buyer";
            r5.postedAt = "2026-06-12";
            r5.quotesCount = 1;
            r5.description = "Write 5 articles on the future of artificial intelligence in 2026. Target word count: 1000 words per article.";
            r5.images = 0;
            r5.uploadedImages = new ArrayList<>();
            r5.aiRiskScore = 6;
            requirementRepository.save(r5);

            Requirement r6 = new Requirement();
            r6.id = "REQ-1718516000000";
            r6.title = "Mobile App UI Design";
            r6.category = "design";
            r6.subCategory = "UI/UX Design";
            r6.budget = 30000;
            r6.deadline = "2026-07-15";
            r6.location = "Remote";
            r6.priority = "high";
            r6.status = "open";
            r6.postedBy = "google-user";
            r6.buyerName = "Google User";
            r6.postedAt = "2026-06-14";
            r6.quotesCount = 1;
            r6.description = "Need a modern UI/UX design for a food delivery mobile application (around 12 screens in Figma).";
            r6.images = 0;
            r6.uploadedImages = new ArrayList<>();
            r6.aiRiskScore = 9;
            requirementRepository.save(r6);

            // 3. POPULATE DUMMY QUOTES
            Quote q1 = new Quote();
            q1.id = "Q-1718521000001";
            q1.requirementId = r1.id;
            q1.requirementTitle = r1.title;
            q1.buyerId = r1.postedBy;
            q1.buyer = r1.buyerName;
            q1.sellerId = "demo-seller";
            q1.seller = "Demo Seller";
            q1.price = 42000;
            q1.deliveryDays = 10;
            q1.rating = 4.8;
            q1.reviews = 12;
            q1.experience = "3+ Years";
            q1.note = "I can deliver a high-quality React site using clean architecture. Let's discuss details.";
            q1.status = "pending";
            q1.submittedAt = "2026-06-16";
            quoteRepository.save(q1);

            Quote q2 = new Quote();
            q2.id = "Q-1718521000002";
            q2.requirementId = r1.id;
            q2.requirementTitle = r1.title;
            q2.buyerId = r1.postedBy;
            q2.buyer = r1.buyerName;
            q2.sellerId = "facebook-user";
            q2.seller = "Facebook User";
            q2.price = 38000;
            q2.deliveryDays = 12;
            q2.rating = 4.5;
            q2.reviews = 5;
            q2.experience = "1 Year";
            q2.note = "I will build this using Vite React and CSS variables. High performance guaranteed.";
            q2.status = "pending";
            q2.submittedAt = "2026-06-16";
            quoteRepository.save(q2);

            Quote q3 = new Quote();
            q3.id = "Q-1718520000001";
            q3.requirementId = r2.id;
            q3.requirementTitle = r2.title;
            q3.buyerId = r2.postedBy;
            q3.buyer = r2.buyerName;
            q3.sellerId = "facebook-user";
            q3.seller = "Facebook User";
            q3.price = 10000;
            q3.deliveryDays = 4;
            q3.rating = 4.5;
            q3.reviews = 5;
            q3.experience = "1 Year";
            q3.note = "I specialize in clean coffee shop branding. Will provide 3 drafts in 4 days.";
            q3.status = "pending";
            q3.submittedAt = "2026-06-15";
            quoteRepository.save(q3);

            Quote q4 = new Quote();
            q4.id = "Q-1718519000001";
            q4.requirementId = r3.id;
            q4.requirementTitle = r3.title;
            q4.buyerId = r3.postedBy;
            q4.buyer = r3.buyerName;
            q4.sellerId = "demo-seller";
            q4.seller = "Demo Seller";
            q4.price = 60000;
            q4.deliveryDays = 5;
            q4.rating = 4.8;
            q4.reviews = 12;
            q4.experience = "3+ Years";
            q4.note = "Happy to help compile parts and build the rig safely. Over 20 builds completed.";
            q4.status = "accepted";
            q4.submittedAt = "2026-06-14";
            quoteRepository.save(q4);

            Quote q5 = new Quote();
            q5.id = "Q-1718518000001";
            q5.requirementId = r4.id;
            q5.requirementTitle = r4.title;
            q5.buyerId = r4.postedBy;
            q5.buyer = r4.buyerName;
            q5.sellerId = "facebook-user";
            q5.seller = "Facebook User";
            q5.price = 15000;
            q5.deliveryDays = 7;
            q5.rating = 4.5;
            q5.reviews = 5;
            q5.experience = "1 Year";
            q5.note = "I will perform on-page SEO, speed optimizations, and keyword analysis using premium tools.";
            q5.status = "accepted";
            q5.submittedAt = "2026-06-14";
            quoteRepository.save(q5);

            Quote q6 = new Quote();
            q6.id = "Q-1718517000001";
            q6.requirementId = r5.id;
            q6.requirementTitle = r5.title;
            q6.buyerId = r5.postedBy;
            q6.buyer = r5.buyerName;
            q6.sellerId = "demo-seller";
            q6.seller = "Demo Seller";
            q6.price = 8000;
            q6.deliveryDays = 3;
            q6.rating = 4.8;
            q6.reviews = 12;
            q6.experience = "3+ Years";
            q6.note = "I have a degree in English Literature and write regularly for technical blogs.";
            q6.status = "accepted";
            q6.submittedAt = "2026-06-13";
            quoteRepository.save(q6);

            Quote q7 = new Quote();
            q7.id = "Q-1718516000001";
            q7.requirementId = r6.id;
            q7.requirementTitle = r6.title;
            q7.buyerId = r6.postedBy;
            q7.buyer = r6.buyerName;
            q7.sellerId = "demo-seller";
            q7.seller = "Demo Seller";
            q7.price = 28000;
            q7.deliveryDays = 7;
            q7.rating = 4.8;
            q7.reviews = 12;
            q7.experience = "3+ Years";
            q7.note = "I can create an amazing interactive Figma prototype for your food app screens.";
            q7.status = "pending";
            q7.submittedAt = "2026-06-15";
            quoteRepository.save(q7);

            // 4. POPULATE DUMMY ORDERS
            Order o1 = new Order();
            o1.id = "ORD-1718519000001";
            o1.title = r3.title;
            o1.requirementId = r3.id;
            o1.seller = q4.seller;
            o1.sellerId = q4.sellerId;
            o1.buyer = q4.buyer;
            o1.buyerId = q4.buyerId;
            o1.amount = q4.price;
            o1.status = "accepted";
            o1.date = "2026-06-14";
            o1.eta = "2026-06-19";
            o1.progress = 30;
            orderRepository.save(o1);

            Order o2 = new Order();
            o2.id = "ORD-1718518000001";
            o2.title = r4.title;
            o2.requirementId = r4.id;
            o2.seller = q5.seller;
            o2.sellerId = q5.sellerId;
            o2.buyer = q5.buyer;
            o2.buyerId = q5.buyerId;
            o2.amount = q5.price;
            o2.status = "accepted";
            o2.date = "2026-06-14";
            o2.eta = "2026-06-21";
            o2.progress = 60;
            orderRepository.save(o2);

            Order o3 = new Order();
            o3.id = "ORD-1718517000001";
            o3.title = r5.title;
            o3.requirementId = r5.id;
            o3.seller = q6.seller;
            o3.sellerId = q6.sellerId;
            o3.buyer = q6.buyer;
            o3.buyerId = q6.buyerId;
            o3.amount = q6.price;
            o3.status = "completed";
            o3.date = "2026-06-13";
            o3.eta = "2026-06-16";
            o3.progress = 100;
            orderRepository.save(o3);

            // 5. POPULATE DUMMY REVIEWS
            Review rev1 = new Review();
            rev1.id = "rv-1718500000001";
            rev1.date = "2026-06-10";
            rev1.helpful = 3;
            rev1.author = "Apple User";
            rev1.target = "Demo Seller";
            rev1.rating = 5;
            rev1.text = "Amazing seller! Very professional and helpful.";
            reviewRepository.save(rev1);

            Review rev2 = new Review();
            rev2.id = "rv-1718500000002";
            rev2.date = "2026-06-08";
            rev2.helpful = 1;
            rev2.author = "Google User";
            rev2.target = "Demo Seller";
            rev2.rating = 4;
            rev2.text = "Good job, delivered on time.";
            reviewRepository.save(rev2);

            Review rev3 = new Review();
            rev3.id = "rv-1718500000003";
            rev3.date = "2026-06-16";
            rev3.helpful = 2;
            rev3.author = "Demo Buyer";
            rev3.target = "Demo Seller";
            rev3.rating = 5;
            rev3.text = "Exceptional writing service. Provided a very detailed tech review for our portal. Highly recommended!";
            reviewRepository.save(rev3);

            // 6. POPULATE DUMMY NOTIFICATIONS
            // Notifications for Demo Buyer
            Notification n1 = new Notification();
            n1.id = "n-1718521000001";
            n1.time = "5 hours ago";
            n1.date = "2026-06-16";
            n1.read = false;
            n1.title = "New Quote Received!";
            n1.text = "Demo Seller submitted a quote of ₹42,000 for 'Need Custom React Website for E-commerce'.";
            n1.type = "info";
            n1.link = "/buyer/quotes";
            notificationRepository.save(n1);

            Notification n2 = new Notification();
            n2.id = "n-1718520000001";
            n2.time = "1 day ago";
            n2.date = "2026-06-15";
            n2.read = true;
            n2.title = "Profile Verified!";
            n2.text = "Your buyer profile was successfully verified by admin.";
            n2.type = "success";
            n2.link = "/buyer/profile";
            notificationRepository.save(n2);

            Notification n3 = new Notification();
            n3.id = "n-1718517000001";
            n3.time = "2 hours ago";
            n3.date = "2026-06-16";
            n3.read = false;
            n3.title = "Order Completed!";
            n3.text = "Demo Seller completed your order 'Content Writing for Tech Portal'.";
            n3.type = "success";
            n3.link = "/buyer/orders";
            notificationRepository.save(n3);

            // Notifications for Demo Seller
            Notification n4 = new Notification();
            n4.id = "n-1718519000001";
            n4.time = "2 days ago";
            n4.date = "2026-06-14";
            n4.read = true;
            n4.title = "Quote Accepted!";
            n4.text = "Your quote of ₹60,000 for 'Gaming PC Build Assembly' was accepted by Apple User.";
            n4.type = "success";
            n4.link = "/seller/orders";
            notificationRepository.save(n4);

            Notification n5 = new Notification();
            n5.id = "n-1718519000002";
            n5.time = "1 day ago";
            n5.date = "2026-06-15";
            n5.read = false;
            n5.title = "New Message";
            n5.text = "Apple User sent you a message regarding the Gaming PC assembly.";
            n5.type = "info";
            n5.link = "/seller/messages";
            notificationRepository.save(n5);
        }
    }
}
