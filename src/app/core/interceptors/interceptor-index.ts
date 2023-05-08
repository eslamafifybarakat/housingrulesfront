import { HttpErrorInterceptor } from './error-interceptor.service';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpInterceptorService } from './http-interceptor.service';

export const interceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  },
];
