import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Leave } from '../../../models/models';

@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pending-approvals.component.html',
  styleUrls: ['./pending-approvals.component.css']
})
export class PendingApprovalsComponent implements OnInit {
  pendingLeaves: Leave[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedLeave: any | null = null;
  approvalComments = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPendingApprovals();
  }

  loadPendingApprovals(): void {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.getPendingApprovals().subscribe({
      next: (data: any[]) => {
        this.pendingLeaves = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Failed to load pending approvals';
      }
    });
  }

  selectLeave(leave: Leave): void {
    this.selectedLeave = leave;
    this.approvalComments = '';
  }

  approveLeave(): void {
    if (!this.selectedLeave) return;

    const approvalData = {
      decision: 'APPROVED',
      comments: this.approvalComments
    };

    this.apiService.approveLeave(this.selectedLeave.id, approvalData).subscribe({
      next: () => {
        this.successMessage = 'Leave approved successfully';
        this.selectedLeave = null;
        this.approvalComments = '';
        this.loadPendingApprovals();
      },
      error: (error: any) => {
        this.errorMessage = error?.error?.message || 'Failed to approve leave';
      }
    });
  }

  rejectLeave(): void {
    if (!this.selectedLeave) return;

    if (!this.approvalComments.trim()) {
      this.errorMessage = 'Please provide a reason for rejection';
      return;
    }

    const approvalData = {
      decision: 'REJECTED',
      comments: this.approvalComments
    };

    this.apiService.rejectLeave(this.selectedLeave.id, approvalData).subscribe({
      next: () => {
        this.successMessage = 'Leave rejected';
        this.selectedLeave = null;
        this.approvalComments = '';
        this.loadPendingApprovals();
      },
      error: (error: any) => {
        this.errorMessage = error?.error?.message || 'Failed to reject leave';
      }
    });
  }

  calculateDays(leave: Leave): number {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  closeModal(): void {
    this.selectedLeave = null;
    this.approvalComments = '';
    this.errorMessage = '';
  }
}
