import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  // const authService = inject(AuthService);
  // if (authService.isAuthenticated()) {
  //   console.log('bla2');
  //   console.log(authService.isAuthenticated);
  //   return true;
  // } else {
  //   return false;
  // }
  return true;
};
