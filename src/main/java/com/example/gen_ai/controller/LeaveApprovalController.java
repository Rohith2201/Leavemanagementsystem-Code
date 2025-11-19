package com.example.gen_ai.controller;

import com.example.gen_ai.model.Leave;
import com.example.gen_ai.service.LeaveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-approvals")
@CrossOrigin(origins = "http://localhost:4200")
public class LeaveApprovalController {
    private final LeaveService leaveService;

    public LeaveApprovalController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping("/pending")
    public List<Leave> getPendingApprovals() {
        return leaveService.getPendingLeaves();
    }
}
