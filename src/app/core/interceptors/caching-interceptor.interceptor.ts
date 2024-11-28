import { Injectable } from '@angular/core';
import { roots } from '../../shared/configs/endPoints';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CachingServiceService } from '../services/caching-service.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  baseUrl: string = environment?.apiUrl;

  private apiUrlsToCache: string[] = [
    `${this.baseUrl}/${roots?.dashboard?.customers?.customersShortList}`,
    `${this.baseUrl}/${roots?.dashboard?.customers?.customersShortList}`,
  ];

  constructor(private cashingService:CachingServiceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(this.cashingService.isCachingEnabled())
    // إذا كانت الـ URL غير موجودة في قائمة الـ APIs المسموح لها بالتخزين المؤقت، نقوم بتمرير الطلب مباشرة
    if (req.method !== 'GET' || !this.shouldCache(req.url)) {
      return next.handle(req);
    }

    // احصل على وقت صلاحية التخزين المؤقت من معلمات الطلب
    const cacheTimeParam = req.params.get('cacheTime');
    const cacheTime = cacheTimeParam ? +cacheTimeParam * 1000 : 300000;
    const cacheKey = req.urlWithParams;

    // تحقق إذا كانت الاستجابة موجودة في التخزين المحلي
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const cachedResponse = JSON.parse(cached);
      if (Date.now() < cachedResponse.expiry) {
        return of(new HttpResponse({ body: cachedResponse.data }));
      } else {
        // إذا كانت صلاحية الكاش انتهت، نقوم بحذفه
        localStorage.removeItem(cacheKey);
      }
    }

    // قم بإجراء الطلب وتخزين الاستجابة
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

  // دالة للتحقق إذا كانت الـ URL في قائمة الـ APIs المسموح لها بالتخزين المؤقت
  private shouldCache(url: string): boolean {
    return this.apiUrlsToCache.some(apiUrl => url.includes(apiUrl));
  }
}
