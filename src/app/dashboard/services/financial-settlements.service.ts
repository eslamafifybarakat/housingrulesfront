import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from './../../shared/configs/endPoints';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialSettlementsService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<any> {
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.financialSettlements?.getUsersByUserType}`)
  }

  getAllByRecivedByAsync(id: any): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("recivedBy", id);
    }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.financialSettlements?.getAllByRecivedByAsync}`, { params: params })
  }
  addFinancialSettlemente(data: any): Observable<any> {
    return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.financialSettlements?.createAsync}`, data);
  }
}
