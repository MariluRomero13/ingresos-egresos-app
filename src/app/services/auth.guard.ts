import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authSvc: AuthService, private router: Router ) {}

  // Dispara la suscripción cuando se carga, es decir, hace una nueva petición
  canLoad(): Observable<boolean> {
    return this.authSvc.isAuth().pipe(
      tap(estado => {
        if (!estado) {
          this.router.navigate(['/login']);
        }
      }),
      take(1)
    );
  }

  canActivate(): Observable<boolean> {
    return this.authSvc.isAuth().pipe(
      tap(estado => {
        if (!estado) {
          this.router.navigate(['/login']);
        }
      })
    );
  }

}
