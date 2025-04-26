import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Token inválido o expirado, redirigiendo al login');
        localStorage.clear();
        setTimeout(() => {
          router.navigate(['/miperfil']);
        }, 0);
      } else if (error.status === 403) {
        console.warn('No tienes permisos para acceder.');
        setTimeout(() => {
          router.navigate(['/']); // 👈 Una página bonita de "Acceso Prohibido"
        }, 0);
      }
      return throwError(() => error);
    })

  );
};
