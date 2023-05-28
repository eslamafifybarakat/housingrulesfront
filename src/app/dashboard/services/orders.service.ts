import { keys } from './../../shared/configs/localstorage-key';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from './../../shared/configs/endPoints';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }


  getGatesList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
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
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.orders?.gatesList}`, {}, { params: params })
  }
  orderDriverArrivedToStationList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
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
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.orders?.orderDriverArrivedToStationList}`, {}, { params: params })
  }
  getOrdersList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
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
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.orders?.ordersList}`, { params: params })
  }
  getOrdersEntityList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any, currentActiveIndex?: any, startTime?: any, endTime?: any, supervisorId?: any, driverId?: any, orderStatus?: any): Observable<any> {
    let userLoginData: any = JSON.parse(window.localStorage.getItem(keys?.userLoginData) || '{}');
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
    if (currentActiveIndex) {
      params = params?.append("currentActiveIndex", currentActiveIndex);
    }
    if (startTime) {
      params = params?.append("startTime", formatDate( startTime,'yyyyMMdd', 'en-US'));
    }
    if (endTime) {
      params = params?.append("endTime", formatDate( endTime,'yyyyMMdd', 'en-US'));
    }
    if (supervisorId) {
      params = params?.append("supervisorId", supervisorId);
    }
    if (driverId) {
      params = params?.append("driverId", driverId);
    }
    if (orderStatus) {
      params = params?.append("orderStatus", orderStatus);
    }
    if (userLoginData?.userType < 3)
      return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.orders?.ordersList}`, { params: params })
    else
      return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.orders?.ordersByTypeList}/${userLoginData?.userType}/${userLoginData?.entityId}`, { params: params })
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
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.customers?.customersList}`)
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
      return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.orders?.updateOrder}`, data);
    } else {
      return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.orders?.crateOrder}`, data);
    }
  }
  addOrUpdateOrderDriverArrivedAtStation(data: any, id?: number): Observable<any> {
    return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.orders?.updateOrderDriverArrivedAtStation}`, data);
  }
  addOrUpdateOrderComplete(data: any, id?: number): Observable<any> {
    return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.orders?.updateOrderComplete}`, data);
  }
  confirmSettlementeOrder(data: any, id?: number): Observable<any> {
    return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.orders?.confirmSettlementeOrderList}`, data);
  }
  setOrderComplete(orderId?: number): Observable<any> {
    let params = new HttpParams();
    if (orderId) {
      params = params?.append("orderId", orderId);
    }
    return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.orders?.updateOrderComplete}`, {}, { params: params });
  }


  getOrderById(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http?.get<any>(`${this.baseUrl}/${roots?.dashboard?.orders?.getOrderById}`, { params: params });
  }

}
