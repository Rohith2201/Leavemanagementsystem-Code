package com.example.gen_ai.controller;

import com.example.gen_ai.model.Leave;
import com.example.gen_ai.model.Employee;
import com.example.gen_ai.dto.LeaveRequest;
import com.example.gen_ai.repository.EmployeeRepository;
import com.example.gen_ai.service.LeaveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {
    private final LeaveService leaveService;
    private final EmployeeRepository employeeRepository;

    public LeaveController(LeaveService leaveService, EmployeeRepository employeeRepository) {
        this.leaveService = leaveService;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Leave> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    @GetMapping("/employee/{employeeId}")
    public List<Leave> getLeavesByEmployee(@PathVariable Long employeeId) {
        return leaveService.getLeavesByEmployee(employeeId);
    }

    @PostMapping
    public Leave applyLeave(@RequestBody LeaveRequest leaveRequest) {
        if (leaveRequest.getEmployeeId() == null) {
            throw new RuntimeException("Employee ID is required");
        }
        Long employeeId = leaveRequest.getEmployeeId();
        @SuppressWarnings("null")
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        Leave leave = new Leave();
        leave.setEmployee(employee);
        leave.setLeaveType(leaveRequest.getLeaveType());
        leave.setStartDate(leaveRequest.getStartDate());
        leave.setEndDate(leaveRequest.getEndDate());
        leave.setReason(leaveRequest.getReason());
        leave.setDocumentPath(leaveRequest.getDocumentPath());
        leave.setStatus("PENDING");
        
        return leaveService.applyLeave(leave);
    }

    @PutMapping("/{leaveId}/cancel")
    public Leave cancelLeave(@PathVariable Long leaveId) {
        return leaveService.cancelLeave(leaveId);
    }

    @PutMapping("/{leaveId}/approve")
    public Leave approveLeave(@PathVariable Long leaveId) {
        return leaveService.approveLeave(leaveId);
    }

    @PutMapping("/{leaveId}/reject")
    public Leave rejectLeave(@PathVariable Long leaveId) {
        return leaveService.rejectLeave(leaveId);
    }

    @GetMapping("/team")
    public List<Leave> getTeamLeaves() {
        return leaveService.getTeamLeaves();
    }
}
