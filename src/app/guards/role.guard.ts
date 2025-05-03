import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  if (!token) {
    router.navigate(['/unauthorized']);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    console.log("decoded JWT:", decoded);

    const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const allowedRoles = route.data['roles'] as string[];
    console.log("User Role:", userRole);
    console.log("Allowed Roles:", allowedRoles);

    if (allowedRoles.includes(userRole)) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  } catch (err) {
    router.navigate(['/unauthorized']);
    return false;
  }
};
