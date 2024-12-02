import { keys } from './../../shared/configs/localstorage-key';
import { AuthUserService } from './../../auth/services/auth-user.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  url: any;
  userData: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public authService: AuthUserService,
    public router: Router,
  ) {
    this.userData = JSON?.parse(window?.localStorage?.getItem(keys?.userLoginData) || "{}");
  }

  checkLogin(): boolean {
    if (this.url.includes('/auth/login')) {
      return true;
    }
    return false;
  }
  authState(): boolean {
    if (this.checkLogin()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    this.router.navigate(['/dashboard']);
    return true;
  }
  notAuthState(): boolean {
    if (this.checkLogin()) {
      return true;
    }
    this.router?.navigate(['/auth/login']);
    return false;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.url = state?.url;

    if (this.authService?.isLoggedIn()) {
      return this.authState();
    }
    return this.notAuthState();
  }

}
