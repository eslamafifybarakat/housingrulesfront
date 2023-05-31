import { keys } from './../../shared/configs/localstorage-key';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from './../../shared/configs/endPoints';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getReportsCategory(): Observable<any> {
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.reports?.getReportsCategory}`, {})
  }

  getOrdersReportList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any,
    currentActiveIndex?: any, startTime = 0, endTime: any = 0, supervisorId: any = 0, driverId: any = 0, orderStatus: any = 0): Observable<any> {
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
    else
      currentActiveIndex = 0;
    if (startTime) {
      params = params?.append("startTime", formatDate(startTime, 'yyyyMMdd', 'en-US'));
      startTime = Number.parseInt(formatDate(startTime, 'yyyyMMdd', 'en-US'));
    }
    else
      startTime = 0;
    if (endTime) {
      params = params?.append("endTime", formatDate(endTime, 'yyyyMMdd', 'en-US'));
      endTime = Number.parseInt(formatDate(endTime, 'yyyyMMdd', 'en-US'));
    }
    else
      endTime = 0;
    if (supervisorId) {
      params = params?.append("supervisorId", supervisorId);
    } else
      supervisorId = 0;
    if (driverId) {
      params = params?.append("driverId", driverId);
    } else
      driverId = 0;
    if (orderStatus) {
      params = params?.append("orderStatus", orderStatus);
    } else
      orderStatus = 0;
    if (userLoginData?.userType < 3)
      return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.orders?.GetOrdersQL}/${startTime}/${endTime}/${supervisorId}/${driverId}/${0}/${orderStatus}/${currentActiveIndex}`)
    // return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.orders?.ordersList}`, { params: params })
    else
      return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.orders?.ordersByTypeList}/${userLoginData?.userType}/${userLoginData?.entityId}`, { params: params })
  }

  orderSearch(data: any, id?: number): Observable<any> {
    return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.tanks?.CreateAsync}`, data);
  }
}
