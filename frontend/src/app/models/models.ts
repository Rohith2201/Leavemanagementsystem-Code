export interface User {
  id: number;
  username: string;
  name?: string; // Added for employee name
  email: string;
  role: string;
  leaveBalance?: number;
}

export interface Leave {
  id?: any;
  employee: User;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  documentPath?: string;
}

export interface LeaveApproval {
  id: number;
  leave: Leave;
  manager: User;
  decision: string;
  comments: string;
  decisionDate: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  leaveBalance: number;
}

export interface LeaveRequest {
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  documentPath?: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
}
