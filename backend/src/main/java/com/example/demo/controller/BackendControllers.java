package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class BackendControllers {

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

    private String uid(String prefix) {
        return prefix + "-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
    }

    private String today() {
        return new SimpleDateFormat("yyyy-MM-dd").format(new Date());
    }

    /* ---------- AUTH CONTROLLER ---------- */

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String email = creds.get("email");
        String password = creds.get("password");

        Optional<User> matchOpt = userRepository.findByEmailIgnoreCase(email);
        Map<String, Object> res = new HashMap<>();

        if (matchOpt.isEmpty()) {
            res.put("ok", false);
            res.put("error", "No account found with this email. Please register first.");
            return ResponseEntity.badRequest().body(res);
        }

        User match = matchOpt.get();
        if (password != null && match.password != null && !match.password.equals(password)) {
            res.put("ok", false);
            res.put("error", "Incorrect password.");
            return ResponseEntity.badRequest().body(res);
        }
        if ("seller".equals(match.role) && "pending".equals(match.status)) {
            res.put("ok", false);
            res.put("error", "Your seller account is awaiting admin approval.");
            return ResponseEntity.badRequest().body(res);
        }
        if ("rejected".equals(match.status)) {
            res.put("ok", false);
            res.put("error", "Your account was rejected by an admin.");
            return ResponseEntity.badRequest().body(res);
        }

        res.put("ok", true);
        res.put("user", match);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User reqUser) {
        boolean exists = userRepository.existsByEmailIgnoreCase(reqUser.email);
        Map<String, Object> res = new HashMap<>();

        if (exists) {
            res.put("ok", false);
            res.put("error", "An account with this email already exists.");
            return ResponseEntity.badRequest().body(res);
        }

        boolean isSeller = "seller".equals(reqUser.role);
        User newUser = new User();
        newUser.id = "u-" + System.currentTimeMillis();
        newUser.name = reqUser.name != null ? reqUser.name : "New User";
        newUser.email = reqUser.email;
        newUser.password = reqUser.password;
        newUser.role = reqUser.role != null ? reqUser.role : "buyer";
        newUser.status = isSeller ? "pending" : "active";
        newUser.verified = false;
        newUser.location = "India";
        newUser.joined = today();
        newUser.bio = isSeller ? "New seller on Reverse Marketplace." : "Just joined Reverse Marketplace.";

        if (isSeller) {
            newUser.rating = 0.0;
            newUser.reviews = 0;
            newUser.completed = 0;
            newUser.experience = "New seller";
            newUser.skills = new ArrayList<>();
        }

        userRepository.save(newUser);

        if (isSeller) {
            res.put("ok", true);
            res.put("pending", true);
            res.put("user", newUser);
            return ResponseEntity.ok(res);
        }

        res.put("ok", true);
        res.put("user", newUser);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/auth/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User profilePatch) {
        Optional<User> targetOpt = userRepository.findById(profilePatch.id);
        if (targetOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User target = targetOpt.get();
        if (profilePatch.name != null) target.name = profilePatch.name;
        if (profilePatch.bio != null) target.bio = profilePatch.bio;
        if (profilePatch.location != null) target.location = profilePatch.location;
        if (profilePatch.experience != null) target.experience = profilePatch.experience;
        if (profilePatch.skills != null) target.skills = profilePatch.skills;

        userRepository.save(target);
        return ResponseEntity.ok(target);
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/users/{id}/status")
    public ResponseEntity<?> setUserStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Optional<User> targetOpt = userRepository.findById(id);

        if (targetOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User target = targetOpt.get();
        if (status != null) {
            target.status = status;
            if ("active".equals(status)) {
                target.verified = true;
            } else if ("rejected".equals(status)) {
                target.verified = false;
            }
        }
        userRepository.save(target);
        return ResponseEntity.ok(target);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    /* ---------- REQUIREMENT CONTROLLER ---------- */

    @GetMapping("/requirements")
    public List<Requirement> getRequirements() {
        return requirementRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/requirements")
    public Requirement addRequirement(@RequestBody Requirement reqForm) {
        Requirement r = new Requirement();
        r.id = uid("REQ");
        r.title = reqForm.title;
        r.category = reqForm.category;
        r.subCategory = reqForm.subCategory != null ? reqForm.subCategory : "";
        r.budget = reqForm.budget;
        r.deadline = reqForm.deadline;
        r.location = reqForm.location != null && !reqForm.location.isEmpty() ? reqForm.location : "Remote";
        r.priority = reqForm.priority != null ? reqForm.priority : "medium";
        r.status = "open";
        r.postedBy = reqForm.postedBy;
        r.buyerName = reqForm.buyerName != null ? reqForm.buyerName : "Buyer";
        r.postedAt = today();
        r.quotesCount = 0;
        r.description = reqForm.description != null ? reqForm.description : "";
        r.uploadedImages = reqForm.uploadedImages != null ? reqForm.uploadedImages : new ArrayList<>();
        r.images = r.uploadedImages.size();
        r.aiRiskScore = (int)(Math.random() * 18) + 4;

        requirementRepository.save(r);
        return r;
    }

    @DeleteMapping("/requirements/{id}")
    public ResponseEntity<?> deleteRequirement(@PathVariable String id) {
        requirementRepository.deleteById(id);
        quoteRepository.deleteByRequirementId(id);
        return ResponseEntity.ok().build();
    }

    /* ---------- QUOTE CONTROLLER ---------- */

    @GetMapping("/quotes")
    public List<Quote> getQuotes() {
        return quoteRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/quotes")
    public Quote addQuote(@RequestBody Quote quoteForm) {
        Quote q = new Quote();
        q.id = uid("Q");
        q.requirementId = quoteForm.requirementId;
        q.requirementTitle = quoteForm.requirementTitle;
        q.buyerId = quoteForm.buyerId;
        q.buyer = quoteForm.buyer;
        q.sellerId = quoteForm.sellerId;
        q.seller = quoteForm.seller != null ? quoteForm.seller : "Seller";
        q.price = quoteForm.price;
        q.deliveryDays = quoteForm.deliveryDays > 0 ? quoteForm.deliveryDays : 5;
        q.rating = quoteForm.rating;
        q.reviews = quoteForm.reviews;
        q.experience = quoteForm.experience != null ? quoteForm.experience : "New seller";
        q.note = quoteForm.note != null ? quoteForm.note : "";
        q.status = "pending";
        q.submittedAt = today();

        quoteRepository.save(q);

        // Update quotes count on the corresponding requirement
        Optional<Requirement> rOpt = requirementRepository.findById(q.requirementId);
        if (rOpt.isPresent()) {
            Requirement r = rOpt.get();
            r.quotesCount = r.quotesCount + 1;
            requirementRepository.save(r);
        }

        return q;
    }

    @DeleteMapping("/quotes/{id}")
    public ResponseEntity<?> deleteQuote(@PathVariable String id) {
        Optional<Quote> qOpt = quoteRepository.findById(id);
        if (qOpt.isPresent()) {
            Quote match = qOpt.get();
            quoteRepository.delete(match);
            
            Optional<Requirement> rOpt = requirementRepository.findById(match.requirementId);
            if (rOpt.isPresent()) {
                Requirement r = rOpt.get();
                r.quotesCount = Math.max(0, r.quotesCount - 1);
                requirementRepository.save(r);
            }
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/quotes/{id}/accept")
    public ResponseEntity<?> acceptQuote(@PathVariable String id) {
        Optional<Quote> qOpt = quoteRepository.findById(id);
        if (qOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Quote acceptedQuote = qOpt.get();

        // Update quote statuses for this requirement
        List<Quote> requirementQuotes = quoteRepository.findAll();
        for (Quote q : requirementQuotes) {
            if (q.requirementId.equals(acceptedQuote.requirementId)) {
                q.status = q.id.equals(acceptedQuote.id) ? "accepted" : "rejected";
                quoteRepository.save(q);
            }
        }

        // Update requirement status
        Optional<Requirement> rOpt = requirementRepository.findById(acceptedQuote.requirementId);
        if (rOpt.isPresent()) {
            Requirement r = rOpt.get();
            r.status = "in_progress";
            requirementRepository.save(r);
        }

        // Create order
        long deliveryMillis = (long) (acceptedQuote.deliveryDays > 0 ? acceptedQuote.deliveryDays : 5) * 24 * 60 * 60 * 1000;
        String etaStr = new SimpleDateFormat("yyyy-MM-dd").format(new Date(System.currentTimeMillis() + deliveryMillis));

        Order order = new Order();
        order.id = uid("ORD");
        order.title = acceptedQuote.requirementTitle;
        order.requirementId = acceptedQuote.requirementId;
        order.seller = acceptedQuote.seller;
        order.sellerId = acceptedQuote.sellerId;
        order.buyer = acceptedQuote.buyer;
        order.buyerId = acceptedQuote.buyerId;
        order.amount = acceptedQuote.price;
        order.status = "accepted";
        order.date = today();
        order.eta = etaStr;
        order.progress = 10;

        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }

    /* ---------- ORDER CONTROLLER ---------- */

    @GetMapping("/orders")
    public List<Order> getOrders() {
        return orderRepository.findAllByOrderByIdDesc();
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable String id, @RequestBody Order orderPatch) {
        Optional<Order> targetOpt = orderRepository.findById(id);
        if (targetOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order target = targetOpt.get();
        if (orderPatch.status != null) target.status = orderPatch.status;
        if (orderPatch.progress > 0) target.progress = orderPatch.progress;

        orderRepository.save(target);
        return ResponseEntity.ok(target);
    }

    /* ---------- REVIEW CONTROLLER ---------- */

    @GetMapping("/reviews")
    public List<Review> getReviews() {
        return reviewRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/reviews")
    public Review addReview(@RequestBody Review r) {
        Review review = new Review();
        review.id = uid("rv");
        review.date = today();
        review.helpful = 0;
        review.author = r.author;
        review.target = r.target;
        review.rating = r.rating;
        review.text = r.text;

        reviewRepository.save(review);
        return review;
    }

    /* ---------- NOTIFICATION CONTROLLER ---------- */

    @GetMapping("/notifications")
    public List<Notification> getNotifications() {
        return notificationRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/notifications")
    public Notification addNotification(@RequestBody Notification n) {
        Notification notification = new Notification();
        notification.id = uid("n");
        notification.time = "Just now";
        notification.date = "Today";
        notification.read = false;
        notification.title = n.title;
        notification.text = n.text;
        notification.type = n.type != null ? n.type : "info";
        notification.link = n.link != null ? n.link : "";

        notificationRepository.save(notification);
        return notification;
    }

    @PostMapping("/notifications/mark-read")
    public ResponseEntity<?> markNotificationsRead() {
        List<Notification> list = notificationRepository.findAll();
        for (Notification n : list) {
            n.read = true;
        }
        notificationRepository.saveAll(list);
        return ResponseEntity.ok().build();
    }
}
