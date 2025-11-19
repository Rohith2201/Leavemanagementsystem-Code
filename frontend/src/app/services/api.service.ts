import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, Leave, LeaveRequest } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Employee APIs
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${employeeId}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees`, employee);
  }

  // Leave APIs
  getLeavesByEmployee(employeeId: number): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/leaves/employee/${employeeId}`);
  }

  applyLeave(leaveRequest: LeaveRequest): Observable<Leave> {
    return this.http.post<Leave>(`${this.apiUrl}/leaves`, leaveRequest);
  }

  approveLeave(leaveId: number, data?: any): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/leaves/${leaveId}/approve`, data || {});
  }

  rejectLeave(leaveId: number, data?: any): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/leaves/${leaveId}/reject`, data || {});
  }

  cancelLeave(leaveId: number): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/leaves/${leaveId}/cancel`, {});
  }

  getAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/leaves`);
  }

  // Team Leaves (for manager view)
  getTeamLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/leaves/team`);
  }

  // Leave Approval APIs
  getPendingApprovals(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leave-approvals/pending`);
  }

  // Admin APIs
  allocateLeaves(employeeId: number, days: number): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/admin/allocate-leaves/${employeeId}?days=${days}`, {});
  }

  getAllEmployeesLeaveStatus(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/admin/employees-leave-status`);
  }

  updateLeaveBalance(employeeId: number, leaveBalance: number): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/admin/update-leave-balance/${employeeId}?leaveBalance=${leaveBalance}`, {});
  }
}
