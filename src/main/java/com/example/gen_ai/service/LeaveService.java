package com.example.gen_ai.service;

import com.example.gen_ai.model.Employee;
import com.example.gen_ai.model.Leave;
import com.example.gen_ai.repository.EmployeeRepository;
import com.example.gen_ai.repository.LeaveRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {
    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveService(LeaveRepository leaveRepository, EmployeeRepository employeeRepository) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    public List<Leave> getLeavesByEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }

    public List<Leave> getPendingLeaves() {
        return leaveRepository.findByStatus("PENDING");
    }

    public List<Leave> getTeamLeaves() {
        // Get all leaves from all employees (for manager view)
        return leaveRepository.findAll();
    }

    public Leave applyLeave(Leave leave) {
        // Validation: check for date conflicts
        Long empId = leave.getEmployee().getId();
        List<Leave> conflicts = leaveRepository.findByEmployeeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                empId, leave.getEndDate(), leave.getStartDate());
        if (!conflicts.isEmpty()) throw new RuntimeException("Leave dates conflict with existing approved leaves.");

        // Validation: check leave balance
        long daysRequested = ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
        Employee emp = employeeRepository.findById(empId).orElseThrow();
        if (emp.getLeaveBalance() < daysRequested) throw new RuntimeException("Insufficient leave balance.");

        leave.setStatus("PENDING");
        return leaveRepository.save(leave);
    }

    public Leave cancelLeave(Long leaveId) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow();
        leave.setStatus("CANCELLED");
        return leaveRepository.save(leave);
    }

    public Leave approveLeave(Long leaveId) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow();
        leave.setStatus("APPROVED");
        Employee emp = leave.getEmployee();
        long days = ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
        emp.setLeaveBalance(emp.getLeaveBalance() - (int) days);
        employeeRepository.save(emp);
        return leaveRepository.save(leave);
    }

    public Leave rejectLeave(Long leaveId) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow();
        leave.setStatus("REJECTED");
        return leaveRepository.save(leave);
    }
}
