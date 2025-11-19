package com.example.gen_ai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class LeaveApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Leave leave;

    @ManyToOne
    private Employee manager;

    private String decision; // APPROVED or REJECTED
    private String comments;
    private LocalDateTime decisionDate;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Leave getLeave() { return leave; }
    public void setLeave(Leave leave) { this.leave = leave; }
    public Employee getManager() { return manager; }
    public void setManager(Employee manager) { this.manager = manager; }
    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public LocalDateTime getDecisionDate() { return decisionDate; }
    public void setDecisionDate(LocalDateTime decisionDate) { this.decisionDate = decisionDate; }
}
