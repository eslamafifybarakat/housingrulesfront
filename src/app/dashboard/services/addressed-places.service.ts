import { roots } from './../../shared/configs/endPoints';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressedPlacesService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getAddressedPlaces(): Observable<any> {
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.addressedPlaces?.getAllAddresses}`)
  }

  addOrUpdateAddress(data: any, id?: number): Observable<any> {
    if (id) {
      return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.addressedPlaces?.updateAddress}`, data);
    } else {
      return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.addressedPlaces?.createAddress}`, data);
    }
  }
  deleteAddress(data:any): Observable<any> {

    return this.http.post<any>(`${this.baseUrl}/${roots?.dashboard?.addressedPlaces?.deleteAddress}`, data);
  } getAddressById(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http?.get<any>(`${this.baseUrl}/${roots?.dashboard?.addressedPlaces?.getByIdAsync}`, { params: params });
  }
  getAllAddressByCustomerId(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http?.get<any>(`${this.baseUrl}/${roots?.dashboard?.addressedPlaces?.GetAllByCustomerIdAsync}`, { params: params });
  }
  deleteAddressId(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http?.post<any>(`${this.baseUrl}/${roots?.dashboard?.customers?.deleteCustomer}`, { "id": id });
  }
}
