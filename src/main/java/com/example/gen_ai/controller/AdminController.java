package com.example.gen_ai.controller;

import com.example.gen_ai.model.Employee;
import com.example.gen_ai.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {
    private final EmployeeService employeeService;

    public AdminController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/allocate-leaves/{employeeId}")
    public ResponseEntity<Employee> allocateLeaves(
            @PathVariable Long employeeId,
            @RequestParam int days) {
        try {
            if (days <= 0 || days > 365) {
                return ResponseEntity.badRequest().build();
            }
            Employee employee = employeeService.allocateLeaves(employeeId, days);
            return ResponseEntity.ok(employee);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/employees-leave-status")
    public ResponseEntity<List<Employee>> getAllEmployeesLeaveStatus() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @PutMapping("/update-leave-balance/{employeeId}")
    public ResponseEntity<Employee> updateLeaveBalance(
            @PathVariable Long employeeId,
            @RequestParam int leaveBalance) {
        try {
            Employee employee = employeeService.updateLeaveBalance(employeeId, leaveBalance);
            return ResponseEntity.ok(employee);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long employeeId) {
        Employee employee = employeeService.getEmployee(employeeId);
        if (employee != null) {
            return ResponseEntity.ok(employee);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
