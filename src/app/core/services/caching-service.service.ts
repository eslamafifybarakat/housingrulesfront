import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CachingServiceService {
  private cachingEnabled: BehaviorSubject<boolean>;

  constructor() {
    // استرجاع القيمة من localStorage إذا كانت موجودة
    const storedCachingValue = localStorage.getItem('cachingEnabled');
    const initialCachingValue = storedCachingValue ? JSON.parse(storedCachingValue) : true;

    // تهيئة الـ BehaviorSubject بالقيمة المخزنة أو الافتراضية
    this.cachingEnabled = new BehaviorSubject<boolean>(initialCachingValue);
  }

  // دالة لتغيير حالة الكاش وتخزين القيمة في localStorage
  setCachingEnabled(enabled: boolean): void {
    this.cachingEnabled.next(enabled);
    localStorage.setItem('cachingEnabled', JSON.stringify(enabled)); // تخزين القيمة في localStorage
  }

  // دالة للاستماع إلى حالة الكاش
  isCachingEnabled() {
    return this.cachingEnabled.asObservable(); // إرجاع Observable للمستمعين
  }
}
