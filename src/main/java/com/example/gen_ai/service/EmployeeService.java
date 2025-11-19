package com.example.gen_ai.service;

import com.example.gen_ai.model.Employee;
import com.example.gen_ai.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployee(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public Employee saveEmployee(Employee employee) {
        // Set default leave balance if not set
        if (employee.getLeaveBalance() <= 0) {
            employee.setLeaveBalance(20); // Default 20 days
        }
        return employeeRepository.save(employee);
    }

    public Employee allocateLeaves(Long employeeId, int days) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
        employee.setLeaveBalance(days);
        return employeeRepository.save(employee);
    }

    public Employee updateLeaveBalance(Long employeeId, int leaveBalance) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
        employee.setLeaveBalance(leaveBalance);
        return employeeRepository.save(employee);
    }
}
