import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Leave } from '../../../models/models';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-leaves.component.html',
  styleUrls: ['./my-leaves.component.css']
})
export class MyLeavesComponent implements OnInit {
  leaves: Leave[] = [];
  loading = false;
  errorMessage = '';
  leaveBalance = 0;
  filteredLeaves: Leave[] = [];
  selectedStatus = 'ALL';

  statusOptions = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
    this.loadLeaveBalance();
  }

  loadLeaveBalance(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.leaveBalance = user.leaveBalance || 0;
    }
  }

  loadLeaves(): void {
    this.loading = true;
    this.errorMessage = '';
    const user = this.authService.currentUserValue;

    if (user) {
      this.apiService.getLeavesByEmployee(user.id).subscribe({
        next: (data: Leave[]) => {
          this.leaves = data;
          this.filterLeaves();
          this.loading = false;
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage = error?.error?.message || 'Failed to load leaves';
        }
      });
    }
  }

  filterLeaves(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredLeaves = this.leaves;
    } else {
      this.filteredLeaves = this.leaves.filter(leave => leave.status === this.selectedStatus);
    }
  }

  onStatusChange(): void {
    this.filterLeaves();
  }

  cancelLeave(leaveId: number): void {
    if (confirm('Are you sure you want to cancel this leave?')) {
      this.apiService.cancelLeave(leaveId).subscribe({
        next: () => {
          this.loadLeaves();
        },
        error: (error: any) => {
          this.errorMessage = error?.error?.message || 'Failed to cancel leave';
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      case 'PENDING':
        return 'status-pending';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
