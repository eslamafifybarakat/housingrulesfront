import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthUserService } from './../../../auth/services/auth-user.service';
import { CheckPermissionService } from './check-permission.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    public authService: AuthUserService,
    private checkPermissionService: CheckPermissionService,
    public router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService?.isLoggedIn() && this.checkPermissionService?.hasPermission(route?.data['permission'])) {
      return true;
    } else {
      return false;
    }
  }

}

