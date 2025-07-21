import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const isLoggedIn = authService.isAuthenticated();
  const goingToLoginPage = state.url === '/login';

  if (isLoggedIn && goingToLoginPage) {
    // Already logged in and trying to access login page
    return router.createUrlTree(['/']);
  }

  // console.log('HElooooooooooooooooooo world');

  if (!isLoggedIn && !goingToLoginPage) {
    // Not logged in and trying to access protected page
    return router.createUrlTree(['/login']);
  }

  // Allow route
  return true;
};
