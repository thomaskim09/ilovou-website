import { AuthenticationService } from '../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.checkLoginStatus()) {
      return true;
    } else {
      this.router.navigate(['/home/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
