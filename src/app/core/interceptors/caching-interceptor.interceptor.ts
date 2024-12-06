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
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    setOrRemoveCacheRequestURL(req, 'Add');

    if (req.method !== 'GET' || !setOrRemoveCacheRequestURL(req, 'Add')) {
      return next.handle(req);
    }

    const cacheTimeParam = req.params.get('cacheTime');
    const cacheTime = cacheTimeParam ? +cacheTimeParam * 1000 : 300000;
    const cacheKey = req.url;
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

          try {
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
          } catch (error) {
            if (this.isQuotaExceeded(error)) {
              console.warn('LocalStorage quota exceeded. Clearing old cache...');
              this.clearOldestCacheItem();
              try {
                localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
              } catch {
                console.warn('Unable to cache this item.');
              }
            } else {
              console.error('Error setting cache:', error);
            }
          }
        }
      }),
      shareReplay(1)
    );
  }

  private isQuotaExceeded(error: any): boolean {
    return error instanceof DOMException &&
      (error.code === 22 || error.code === 1014 || error.name === 'QuotaExceededError');
  }

  private clearOldestCacheItem(): void {
    const keys = Object.keys(localStorage);
    let oldestKey: string | null = null;
    let oldestExpiry = Infinity;

    keys.forEach(key => {
      try {
        const cachedItem = JSON.parse(localStorage.getItem(key) || '{}');
        if (cachedItem?.expiry && cachedItem.expiry < oldestExpiry) {
          oldestExpiry = cachedItem.expiry;
          oldestKey = key;
        }
      } catch {
        // Ignore invalid JSON
      }
    });

    if (oldestKey) {
      localStorage.removeItem(oldestKey);
      console.log(`Removed oldest cache item: ${oldestKey}`);
    }
  }
}
