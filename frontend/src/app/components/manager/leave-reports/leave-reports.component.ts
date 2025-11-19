import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Leave, User } from '../../../models/models';

@Component({
  selector: 'app-leave-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-reports.component.html',
  styleUrls: ['./leave-reports.component.css']
})
export class LeaveReportsComponent implements OnInit {
  allLeaves: Leave[] = [];
  teamMembers: User[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  // Report filters
  selectedEmployee: string = 'all';
  reportStartDate: string = '';
  reportEndDate: string = '';

  // Report statistics
  totalLeaves: number = 0;
  approvedLeaves: number = 0;
  pendingLeaves: number = 0;
  rejectedLeaves: number = 0;
  cancelledLeaves: number = 0;

  // Leave type breakdown
  leaveTypeBreakdown: { [key: string]: number } = {
    'VACATION': 0,
    'SICK': 0,
    'PERSONAL': 0,
    'CASUAL': 0
  };

  // Employee-wise breakdown
  employeeWiseBreakdown: { [key: string]: { name: string; total: number; approved: number; pending: number; rejected: number; cancelled: number; } } = {};

  // Monthly breakdown
  monthlyBreakdown: any[] = [];

  displayedReports: 'summary' | 'breakdown' | 'employee' | 'monthly' = 'summary';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadReportData();
    this.initializeDateRange();
  }

  initializeDateRange(): void {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    this.reportEndDate = this.formatDate(today);
    this.reportStartDate = this.formatDate(startOfYear);
  }

  loadReportData(): void {
    this.loading = true;
    this.errorMessage = '';

    // Load all leaves and team members
    Promise.all([
      this.apiService.getTeamLeaves().toPromise(),
      this.apiService.getAllEmployees().toPromise()
    ]).then(([leaves, employees]: [Leave[] | undefined, any[] | undefined]) => {
      this.allLeaves = leaves || [];
      this.teamMembers = employees || [];
      this.generateReports();
      this.loading = false;
    }).catch(err => {
      this.errorMessage = 'Failed to load report data';
      console.error('Error loading report data:', err);
      this.loading = false;
    });
  }

  generateReports(): void {
    this.calculateStatistics();
    this.calculateLeaveTypeBreakdown();
    this.calculateEmployeeWiseBreakdown();
    this.calculateMonthlyBreakdown();
  }

  calculateStatistics(): void {
    const leaves = this.filterLeavesByDateRange(this.allLeaves);

    this.totalLeaves = leaves.length;
    this.approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length;
    this.pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
    this.rejectedLeaves = leaves.filter(l => l.status === 'REJECTED').length;
    this.cancelledLeaves = leaves.filter(l => l.status === 'CANCELLED').length;
  }

  calculateLeaveTypeBreakdown(): void {
    this.leaveTypeBreakdown = {
      'VACATION': 0,
      'SICK': 0,
      'PERSONAL': 0,
      'CASUAL': 0
    };

    const leaves = this.filterLeavesByDateRange(this.allLeaves);

    leaves.forEach(leave => {
      if (leave.status === 'APPROVED') {
        this.leaveTypeBreakdown[leave.leaveType] = (this.leaveTypeBreakdown[leave.leaveType] || 0) + 1;
      }
    });
  }

  calculateEmployeeWiseBreakdown(): void {
    this.employeeWiseBreakdown = {};

    const leaves = this.filterLeavesByDateRange(this.allLeaves);

    leaves.forEach(leave => {
      const employeeId = leave.employee.id.toString();
      const employeeName = leave.employee.username;

      if (!this.employeeWiseBreakdown[employeeId]) {
        this.employeeWiseBreakdown[employeeId] = {
          name: employeeName,
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          cancelled: 0
        };
      }

      this.employeeWiseBreakdown[employeeId].total++;

      if (leave.status === 'APPROVED') {
        this.employeeWiseBreakdown[employeeId].approved++;
      } else if (leave.status === 'PENDING') {
        this.employeeWiseBreakdown[employeeId].pending++;
      } else if (leave.status === 'REJECTED') {
        this.employeeWiseBreakdown[employeeId].rejected++;
      } else if (leave.status === 'CANCELLED') {
        this.employeeWiseBreakdown[employeeId].cancelled++;
      }
    });
  }

  calculateMonthlyBreakdown(): void {
    this.monthlyBreakdown = [];

    const leaves = this.filterLeavesByDateRange(this.allLeaves);
    const monthlyMap: { [key: string]: { approved: number; pending: number; rejected: number; cancelled: number; } } = {};

    leaves.forEach(leave => {
      const date = new Date(leave.startDate);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { approved: 0, pending: 0, rejected: 0, cancelled: 0 };
      }

      if (leave.status === 'APPROVED') {
        monthlyMap[monthKey].approved++;
      } else if (leave.status === 'PENDING') {
        monthlyMap[monthKey].pending++;
      } else if (leave.status === 'REJECTED') {
        monthlyMap[monthKey].rejected++;
      } else if (leave.status === 'CANCELLED') {
        monthlyMap[monthKey].cancelled++;
      }
    });

    this.monthlyBreakdown = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      ...data,
      total: data.approved + data.pending + data.rejected + data.cancelled
    }));
  }

  filterLeavesByDateRange(leaves: Leave[]): Leave[] {
    if (!this.reportStartDate || !this.reportEndDate) {
      return leaves;
    }

    const start = new Date(this.reportStartDate);
    const end = new Date(this.reportEndDate);
    end.setHours(23, 59, 59, 999);

    return leaves.filter(leave => {
      const leaveDate = new Date(leave.startDate);
      return leaveDate >= start && leaveDate <= end;
    });
  }

  onDateRangeChange(): void {
    this.generateReports();
  }

  switchReport(report: 'summary' | 'breakdown' | 'employee' | 'monthly'): void {
    this.displayedReports = report;
  }

  getApprovalPercentage(): number {
    if (this.totalLeaves === 0) return 0;
    return Math.round((this.approvedLeaves / this.totalLeaves) * 100);
  }

  getPendingPercentage(): number {
    if (this.totalLeaves === 0) return 0;
    return Math.round((this.pendingLeaves / this.totalLeaves) * 100);
  }

  getRejectionPercentage(): number {
    if (this.totalLeaves === 0) return 0;
    return Math.round((this.rejectedLeaves / this.totalLeaves) * 100);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getEmployeeBreakdownArray(): Array<{ id: string; data: any }> {
    return Object.entries(this.employeeWiseBreakdown).map(([id, data]) => ({
      id,
      data
    }));
  }

  exportReport(): void {
    // Generate CSV or PDF export
    const reportData = {
      generatedOn: new Date().toLocaleString(),
      period: `${this.reportStartDate} to ${this.reportEndDate}`,
      summary: {
        totalLeaves: this.totalLeaves,
        approved: this.approvedLeaves,
        pending: this.pendingLeaves,
        rejected: this.rejectedLeaves,
        cancelled: this.cancelledLeaves
      },
      leaveTypeBreakdown: this.leaveTypeBreakdown,
      employeeWiseData: this.employeeWiseBreakdown
    };

    const csvContent = this.convertToCSV(reportData);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `leave-report-${new Date().getTime()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  convertToCSV(reportData: any): string {
    let csv = `Leave Management Report\n`;
    csv += `Generated on: ${reportData.generatedOn}\n`;
    csv += `Period: ${reportData.period}\n\n`;

    csv += `Summary Statistics\n`;
    csv += `Total Leaves,${reportData.summary.totalLeaves}\n`;
    csv += `Approved,${reportData.summary.approved}\n`;
    csv += `Pending,${reportData.summary.pending}\n`;
    csv += `Rejected,${reportData.summary.rejected}\n`;
    csv += `Cancelled,${reportData.summary.cancelled}\n\n`;

    csv += `Leave Type Breakdown\n`;
    Object.entries(reportData.leaveTypeBreakdown).forEach(([type, count]: [string, any]) => {
      csv += `${type},${count}\n`;
    });

    csv += `\nEmployee-wise Breakdown\n`;
    csv += `Employee,Total,Approved,Pending,Rejected,Cancelled\n`;
    Object.entries(reportData.employeeWiseData).forEach(([, data]: [string, any]) => {
      csv += `${data.name},${data.total},${data.approved},${data.pending},${data.rejected},${data.cancelled}\n`;
    });

    return csv;
  }
}
