package com.example.demo.repository;

import com.example.demo.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, String> {
    List<Quote> findAllByOrderByIdDesc();
    
    @Transactional
    void deleteByRequirementId(String requirementId);
}
