import { Component } from '@angular/core';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(public authService: Auth, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.loggedIn && this.authService.isAuthenticated()) {
      this.router.navigate(['/']); // Redirect to dashboard
    }
  }

  handleLogin() {
    this.authService.login('yaseen');
    this.router.navigate(['/']);
  }
}
