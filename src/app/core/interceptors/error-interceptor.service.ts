import { AuthUserService } from './../../auth/services/auth-user.service';
import { AlertsService } from './../services/alerts/alerts.service';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {


  constructor(
    private authUserService: AuthUserService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          console.log(error);
          
          if (error.error instanceof ErrorEvent) {
            console.error('this is client side error');
            errorMsg = `Error: ${error.error.message}`;
          }
          else {
            console.error('this is server side error');
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          }
          if (error?.status == 500) {

          }
          if (error?.status == 403) {
            window.location.reload();
          }

          if (error?.status == 404) {
          }
          if (error?.status == 400) {
          }
          if (error?.status == 401) {
            //Remove all items in local storage, beacuse this request was expired from another device
            this.authUserService?.signOut();
          }
          return throwError(errorMsg);
        })
      )
  }
}
