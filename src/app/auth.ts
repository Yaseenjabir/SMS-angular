import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  public loggedIn = false;

  constructor() {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('isLoggedIn') === 'true'
    ) {
      this.loggedIn = true;
    }
  }

  login(): void {
    this.loggedIn = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
    }
  }

  logout(): void {
    this.loggedIn = false;
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'false');
    }
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }
}
