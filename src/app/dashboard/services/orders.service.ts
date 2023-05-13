import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from './../../shared/configs/endPoints';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getOrdersList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
    let params = new HttpParams();
    // if (page) {
    //   params = params?.append("page", page);
    // }
    // if (per_page) {
    //   params = params?.append("per_page", per_page);
    // }
    // if (search) {
    //   params = params?.append("search", search);
    // }
    // if (sort && Object.keys(sort)?.length > 0) {
    //   params = params?.append("sort", JSON?.stringify(sort));
    // }
    // if (conditions && conditions?.length > 0) {
    //   params = params?.append("conditions", JSON?.stringify(conditions));
    // }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.orders?.ordersList}`, { params: params })
  }
  getCustomersList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
    let params = new HttpParams();
    // if (page) {
    //   params = params?.append("page", page);
    // }
    // if (per_page) {
    //   params = params?.append("per_page", per_page);
    // }
    // if (search) {
    //   params = params?.append("search", search);
    // }
    // if (sort && Object.keys(sort)?.length > 0) {
    //   params = params?.append("sort", JSON?.stringify(sort));
    // }
    // if (conditions && conditions?.length > 0) {
    //   params = params?.append("conditions", JSON?.stringify(conditions));
    // }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.customersList}`, { params: params })
  }
  getDistrictsList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
    let params = new HttpParams();
    // if (page) {
    //   params = params?.append("page", page);
    // }
    // if (per_page) {
    //   params = params?.append("per_page", per_page);
    // }
    // if (search) {
    //   params = params?.append("search", search);
    // }
    // if (sort && Object.keys(sort)?.length > 0) {
    //   params = params?.append("sort", JSON?.stringify(sort));
    // }
    // if (conditions && conditions?.length > 0) {
    //   params = params?.append("conditions", JSON?.stringify(conditions));
    // }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.districtsList}`, { params: params })
  }

  addOrUpdateOrder(data: any, id?: number): Observable<any> {
    if (id) {
      return this.http?.put<any[]>(`${this.baseUrl}/${roots?.dashboard?.orders?.updateOrder}`, data);
    } else {
      return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.orders?.crateOrder}`, data);
    }
  }

  getOrderById(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http?.get<any>(`${this.baseUrl}/${roots?.dashboard?.orders?.getOrderById}`, { params: params });
  }
}
