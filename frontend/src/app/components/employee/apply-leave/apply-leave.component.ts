import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { LeaveRequest } from '../../../models/models';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent implements OnInit {
  applyLeaveForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  leaveBalance = 20;

  leaveTypes = ['VACATION', 'SICK', 'PERSONAL', 'CASUAL'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.applyLeaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      documentPath: ['']
    });
  }

  ngOnInit(): void {
    this.loadLeaveBalance();
  }

  loadLeaveBalance(): void {
    // Get current user from localStorage/auth service
    const user = this.authService.currentUserValue;
    
    if (user && user.id) {
      // Fetch employee details to get leave balance
      this.apiService.getEmployeeById(user.id).subscribe({
        next: (employee: any) => {
          this.leaveBalance = employee.leaveBalance || 0;
        },
        error: (err: any) => {
          console.error('Error loading leave balance:', err);
          // Fallback: try to get from localStorage
          const userDetails = localStorage.getItem('currentUser');
          if (userDetails) {
            const parsed = JSON.parse(userDetails);
            this.leaveBalance = parsed.leaveBalance || 0;
          }
        }
      });
    }
  }

  onSubmit(): void {
    if (this.applyLeaveForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    const startDate = new Date(this.applyLeaveForm.get('startDate')?.value);
    const endDate = new Date(this.applyLeaveForm.get('endDate')?.value);

    if (endDate < startDate) {
      this.errorMessage = 'End date must be after start date';
      return;
    }

    const daysRequested = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (daysRequested > this.leaveBalance) {
      this.errorMessage = `Insufficient leave balance. You have ${this.leaveBalance} days available but requested ${daysRequested} days`;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const user = this.authService.currentUserValue!;
    const leaveRequest: LeaveRequest = {
      employeeId: user.id,
      leaveType: this.applyLeaveForm.get('leaveType')?.value,
      startDate: this.applyLeaveForm.get('startDate')?.value,
      endDate: this.applyLeaveForm.get('endDate')?.value,
      reason: this.applyLeaveForm.get('reason')?.value,
      documentPath: this.applyLeaveForm.get('documentPath')?.value
    };

    this.apiService.applyLeave(leaveRequest).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Leave application submitted successfully!';
        this.applyLeaveForm.reset();
        this.loadLeaveBalance();
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Failed to apply leave. Please try again.';
      }
    });
  }
}
