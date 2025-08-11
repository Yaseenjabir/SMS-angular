import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const goingToLoginPage = state.url === '/login';

  return authService.checkAuth().pipe(
    map((isLoggedIn) => {
      if (isLoggedIn && goingToLoginPage) {
        return router.createUrlTree(['/']);
      }

      if (!isLoggedIn && !goingToLoginPage) {
        return router.createUrlTree(['/login']);
      }

      return true;
    })
  );
};
