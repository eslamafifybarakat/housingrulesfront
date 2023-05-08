import { environment } from './../../../environments/environment';
import { roots } from './../../shared/configs/endPoints';
import { Router } from '@angular/router';
import { keys } from './../../shared/configs/localstorage-key';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {
  apiUrl = environment?.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(data: any): Observable<any> {
    return this.http?.post<any>(this.apiUrl + roots?.auth?.login, data);
  }
  getUserData(): Observable<any> {
    return this.http?.get<any>(this.apiUrl + roots?.auth?.getUserData);
  }
  forgetPassword(data: any): Observable<any> {
    return this.http?.post<any>(this.apiUrl + roots?.auth?.forgetPassword, data);
  }
  isLoggedIn(): boolean {
    return window?.localStorage?.getItem(keys?.userLoginData) ? true : false;
  }
  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }
  signOut(): any {
    window?.localStorage?.removeItem(keys?.logged);
    window?.localStorage?.removeItem(keys?.userLoginData);
    window?.localStorage?.removeItem(keys?.userData);
    window?.localStorage?.removeItem(keys?.token);
    this.router?.navigate(['/auth']);
  }
}
