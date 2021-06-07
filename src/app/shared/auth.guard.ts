import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot,
UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log(this.authService.is_2fa_completed, typeof (this.authService.is_2fa_completed));
    console.log(this.authService.isLoggedIn, typeof (this.authService.isLoggedIn));

    if (this.authService.isLoggedIn !== true || this.authService.is_2fa_completed !== true) {
      console.log(this.authService.is_2fa_completed);

      window.alert('Access not allowed!');
      if (this.authService.isLoggedIn !== true) {
        this.router.navigate(['/login']);
        return false;
      }
      //

      if (this.authService.is_2fa_completed !== true) {
        if (this.authService.isPrevValid === true) {
          this.router.navigate(['/verify']);
          return false;
        } else {
          this.router.navigate(['/qrcode']);
          return false;
        }


      }
      this.router.navigate(['/login']);
    }
    return true;
  }
}
