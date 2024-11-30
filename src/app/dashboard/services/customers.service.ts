import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { roots } from '../../shared/configs/endPoints';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getCustomersList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params?.append("page", page);
    }
    if (per_page) {
      params = params?.append("per_page", per_page);
    }
    if (search) {
      params = params?.append("search", search);
    }
    if (sort && Object.keys(sort)?.length > 0) {
      params = params?.append("sort", JSON?.stringify(sort));
    }
    if (conditions && conditions?.length > 0) {
      params = params?.append("conditions", JSON?.stringify(conditions));
    }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.customers?.customersList}`, { params: params })
  }
  addOrUpdateCustomer(data: any, id?: number, headers?: HttpHeaders): Observable<any> {
    // تحديد الخيارات مع الترويسة المطلوبة (إن كانت موجودة)
    const options = {
      headers: headers || new HttpHeaders(),
    };
  
    // تحديد URL بناءً على ما إذا كنت تقوم بتحديث أو إضافة عميل
    const url = id
      ? `${this.baseUrl}/${roots?.dashboard?.customers?.updateCustomer}`
      : `${this.baseUrl}/${roots?.dashboard?.customers?.createCustomer}`;
  
    // أولاً، نرسل الطلب مع الترويسة لتخطي الـ Interceptor
    if (headers) {
      options.headers = options.headers.set('skipInterceptor', 'true');
    }
  
    // إرسال الطلب (إنشاء أو تحديث العميل)
    return this.http?.post<any[]>(url, data, options).pipe(
      tap((response) => {
        // هنا، نعيد التفعيل للـ Interceptor بعد إجراء الطلب
        // إلغاء الترويسة 'skipInterceptor' في حالة أردت التأثير بالـ Interceptor مرة أخرى
        if (headers) {
          options.headers = options.headers.delete('skipInterceptor');
        }
      })
    );
  }
  
  deleteCustomerId(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http?.post<any>(`${this.baseUrl}/${roots?.dashboard?.customers?.deleteCustomer}`, { "id": id });
  }
  getCustomerById(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http?.get<any>(`${this.baseUrl}/${roots?.dashboard?.customers?.getByIdAsync}`, { params: params });
  }

  canCustomerSubmitOrder(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http?.get<any>(`${this.baseUrl}/${roots?.dashboard?.customers?.CanSubmitOrder}`, { params: params });
  }

  createAsyncSchudle(data: any): Observable<any> {
    return this.http?.post<any>(`${this.baseUrl}/${roots?.dashboard?.customers?.createAsyncSchudle}`, data);
  }

  getByIdAsyncOrderSchedule(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http?.get<any>(`${this.baseUrl}/${roots?.dashboard?.customers?.getByIdAsyncOrderSchedule}`, { params: params });
  }
}
