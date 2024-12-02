import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { setOrRemoveCacheRequestURL } from 'src/app/common/interceptors/caching/caching.utils';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    setOrRemoveCacheRequestURL(req,'Add');

    if (req.method !== 'GET' || !setOrRemoveCacheRequestURL(req,'Add')) {
      return next.handle(req);
    }

    const cacheTimeParam = req.params.get('cacheTime');
    const cacheTime = cacheTimeParam ? +cacheTimeParam * 1000 : 300000;
    const cacheKey = req.urlWithParams;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const cachedResponse = JSON.parse(cached);
      if (Date.now() < cachedResponse.expiry) {
        return of(new HttpResponse({ body: cachedResponse.data }));
      } else {
        localStorage.removeItem(cacheKey);
      }
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const dataToCache = {
            data: event.body,
            expiry: Date.now() + cacheTime
          };
          localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        }
      }),
      shareReplay(1)
    );
  }
}
