import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Employee } from '../../../models/models';

@Component({
  selector: 'app-allocate-leaves',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './allocate-leaves.component.html',
  styleUrls: ['./allocate-leaves.component.css']
})
export class AllocateLeavesComponent implements OnInit {
  employees: Employee[] = [];
  allocateForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.allocateForm = this.fb.group({
      employeeId: ['', Validators.required],
      leaveBalance: ['', [Validators.required, Validators.min(1), Validators.max(365)]]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.apiService.getAllEmployeesLeaveStatus().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        if (data.length === 0) {
          this.errorMessage = 'No employees found. Please create employees first.';
        }
      },
      error: (error: any) => {
        console.error('Error loading employees:', error);
        this.errorMessage = error?.error?.message || 'Failed to load employees';
      }
    });
  }

  onAllocate(): void {
    if (this.allocateForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const employeeId = this.allocateForm.get('employeeId')?.value;
    const days = this.allocateForm.get('leaveBalance')?.value;

    this.apiService.allocateLeaves(employeeId, days).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.successMessage = `Successfully allocated ${days} leaves to employee`;
        this.errorMessage = '';
        this.allocateForm.reset();
        setTimeout(() => {
          this.loadEmployees();
          this.successMessage = '';
        }, 2000);
      },
      error: (error: any) => {
        this.loading = false;
        this.successMessage = '';
        this.errorMessage = error?.error?.message || 'Failed to allocate leaves. Please try again.';
        console.error('Error allocating leaves:', error);
      }
    });
  }
}
