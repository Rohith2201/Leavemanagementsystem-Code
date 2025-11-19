import { Routes } from '@angular/router';
import { LoginComponent } from './app/components/auth/login/login.component';
import { RegisterComponent } from './app/components/auth/register/register.component';
import { DashboardComponent } from './app/components/employee/dashboard/dashboard.component';
import { ApplyLeaveComponent } from './app/components/employee/apply-leave/apply-leave.component';
import { MyLeavesComponent } from './app/components/employee/my-leaves/my-leaves.component';
import { PendingApprovalsComponent } from './app/components/manager/pending-approvals/pending-approvals.component';
import { TeamLeavesComponent } from './app/components/manager/team-leaves/team-leaves.component';
import { LeaveReportsComponent } from './app/components/manager/leave-reports/leave-reports.component';
import { AllocateLeavesComponent } from './app/components/admin/allocate-leaves/allocate-leaves.component';
import { AuthGuard } from './app/guards/auth.guard';
import { RoleGuard } from './app/guards/role.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'my-leaves',
        component: MyLeavesComponent,
        canActivate: [RoleGuard],
        data: { role: 'EMPLOYEE' }
      },
      {
        path: 'apply-leave',
        component: ApplyLeaveComponent,
        canActivate: [RoleGuard],
        data: { role: 'EMPLOYEE' }
      },
      {
        path: 'approvals',
        component: PendingApprovalsComponent,
        canActivate: [RoleGuard],
        data: { role: 'MANAGER' }
      },
      {
        path: 'team-leaves',
        component: TeamLeavesComponent,
        canActivate: [RoleGuard],
        data: { role: 'MANAGER' }
      },
      {
        path: 'reports',
        component: LeaveReportsComponent,
        canActivate: [RoleGuard],
        data: { role: 'MANAGER' }
      },
      {
        path: 'allocate-leaves',
        component: AllocateLeavesComponent,
        canActivate: [RoleGuard],
        data: { role: 'MANAGER' }
      }
    ]
  }
];
