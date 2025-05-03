// auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token')) {
    return next(req); 
  }
  
  const http = inject(HttpClient);
  const router = inject(Router);

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const expiryDate = localStorage.getItem('expiryDate');

  if (!accessToken || !expiryDate || new Date(expiryDate) < new Date()) {
    return refreshTokenRequest(http, refreshToken).pipe(
      switchMap((newTokens: { 
        accessToken: string; 
        refreshToken: string; 
        expiryDate: string 
      }) => {
        localStorage.setItem('accessToken', newTokens.accessToken);
        localStorage.setItem('refreshToken', newTokens.refreshToken);
        localStorage.setItem('expiryDate', newTokens.expiryDate);

        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${newTokens.accessToken}`)
        });
        return next(authReq);
      }),
      catchError((err) => {
        localStorage.clear();
        router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
  });
  return next(authReq);
};

const refreshTokenRequest = (
  http: HttpClient,
  refreshToken: string | null
): Observable<{
  accessToken: string;
  refreshToken: string;
  expiryDate: string;
}> => {
  return http.post<{
    accessToken: string;
    refreshToken: string;
    expiryDate: string;
  }>('http://localhost:5192/api/auth/refresh-token', { refreshToken });
};