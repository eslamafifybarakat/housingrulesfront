import { TranslateService } from '@ngx-translate/core';
import { keys } from './../../shared/configs/localstorage-key';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  browserLang: any = '';
  constructor(private translateService: TranslateService) { }
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // console.clear();
    if (window.navigator.onLine) {
      if (
        request.url.startsWith('https://ipapi.co/json') ||
        request.url.includes('login') ||
        request.url.includes('forget-password')
      ) {
        return next.handle(request);
      }

      let header: any = {};
      if (window.localStorage.getItem(keys.language)) {
        header["lang"] = window.localStorage.getItem(
          keys.language
        );
      } else {
        this.browserLang = this.translateService.getBrowserLang();
        window.localStorage.setItem(keys.language, this.browserLang);
      }


      let tokenKey = window.localStorage.getItem(keys.token);
      if (tokenKey) {
        header["Authorization"] = `Bearer ${tokenKey}`;
      }

      let tenantidKey = window.localStorage.getItem(keys.tenantid);
      if (tenantidKey) {
        header["tenantid"] = tenantidKey;
      }
      request = request.clone({
        setHeaders: header,
        // url: request.url.replace("http", "https"),
      });

      return next.handle(request);
    } else {
      return next.handle(request);
    }
  }
}

