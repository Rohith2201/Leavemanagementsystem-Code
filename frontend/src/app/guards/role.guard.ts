import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    const currentUser = this.authService.currentUserValue;

    if (currentUser && requiredRole && currentUser.role === requiredRole) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
