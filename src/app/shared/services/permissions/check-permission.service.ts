import { keys } from '../../configs/localstorage-key';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionService {
  userData: any;

  constructor() {
    this.userData = JSON.parse(window.localStorage.getItem(keys.userData) || '{}');
  }

  public hasPermission(permissionKey: string): boolean {
    return this.userData?.permissions?.includes(permissionKey);
  }
}
