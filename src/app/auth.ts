import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  public loggedIn = false;
  public user: { name: string } | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userData = localStorage.getItem('user');
      this.user = userData ? JSON.parse(userData) : null;
    }
  }

  login(name: string): void {
    this.loggedIn = true;
    this.user = { name }; // Store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }

  logout(): void {
    this.loggedIn = false;
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('user');
    }
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }
}
