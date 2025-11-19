import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  userRole$: Observable<string | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = new Observable(observer => {
      observer.next(this.authService.isLoggedIn());
    });
    this.currentUser$ = this.authService.currentUser$;
    this.userRole$ = new Observable(observer => {
      this.authService.currentUser$.subscribe(user => {
        observer.next(user?.role || null);
      });
    });
  }

  ngOnInit(): void {
    // Update login status when auth state changes
    this.authService.token$.subscribe(token => {
      this.isLoggedIn$ = new Observable(observer => {
        observer.next(!!token);
      });
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
