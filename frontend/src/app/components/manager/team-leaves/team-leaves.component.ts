import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Leave, User } from '../../../models/models';

@Component({
  selector: 'app-team-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-leaves.component.html',
  styleUrls: ['./team-leaves.component.css']
})
export class TeamLeavesComponent implements OnInit {
  teamLeaves: Leave[] = [];
  teamMembers: User[] = [];
  selectedEmployee: string = 'all';
  selectedStatus: string = 'all';
  filteredLeaves: Leave[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  
  // Calendar view properties
  currentMonth: Date = new Date();
  calendarWeeks: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTeamLeaves();
    this.loadTeamMembers();
    this.generateCalendar();
  }

  loadTeamLeaves(): void {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.getTeamLeaves().subscribe({
      next: (data: Leave[]) => {
        this.teamLeaves = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load team leaves';
        console.error('Error loading team leaves:', err);
        this.loading = false;
      }
    });
  }

  loadTeamMembers(): void {
    this.apiService.getAllEmployees().subscribe({
      next: (data: any[]) => {
        this.teamMembers = data;
      },
      error: (err) => {
        console.error('Error loading team members:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredLeaves = this.teamLeaves.filter(leave => {
      const employeeMatch = this.selectedEmployee === 'all' || 
                           leave.employee.id === parseInt(this.selectedEmployee);
      
      const statusMatch = this.selectedStatus === 'all' || 
                         leave.status === this.selectedStatus;

      return employeeMatch && statusMatch;
    });
  }

  onEmployeeChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  calculateDays(leave: Leave): number {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  // Calendar generation for team leave view
  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarWeeks = [];
    let week: any[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const leavesOnDay = this.teamLeaves.filter(leave => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        return date >= startDate && date <= endDate && leave.status === 'APPROVED';
      });

      week.push({
        date: day,
        fullDate: new Date(date),
        leaves: leavesOnDay
      });

      if (week.length === 7) {
        this.calendarWeeks.push(week);
        week = [];
      }
    }

    // Fill remaining cells
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      this.calendarWeeks.push(week);
    }
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  getMonthYearString(): string {
    return this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  getLeaveTypeColor(leaveType: string): string {
    const colors: { [key: string]: string } = {
      'VACATION': '#FFB6C1',
      'SICK': '#87CEEB',
      'PERSONAL': '#F0E68C',
      'CASUAL': '#98FB98'
    };
    return colors[leaveType] || '#D3D3D3';
  }

  getDayStatusClass(day: any): string {
    if (!day || day.leaves.length === 0) return '';
    
    const leaveTypes: string[] = day.leaves.map((l: Leave) => l.leaveType);
    if (leaveTypes.includes('VACATION')) return 'vacation';
    if (leaveTypes.includes('SICK')) return 'sick';
    if (leaveTypes.includes('PERSONAL')) return 'personal';
    if (leaveTypes.includes('CASUAL')) return 'casual';
    
    return 'leave-day';
  }
}
