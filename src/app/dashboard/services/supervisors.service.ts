import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from '../../shared/configs/endPoints';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SupervisorsService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getSupervisorsList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any): Observable<any> {
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
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.supervisors?.supervisorsList}`, { params: params })
  }
  supervisorToggleStatus(id: number): Observable<any> {
    return this.http?.post<any>(`${this.baseUrl}/${roots?.dashboard?.supervisors?.supervisorToggleStatus}/` + id, {});
  }
  addOrUpdateSupervisor(data: any, id?: number): Observable<any> {
    if (id) {
      return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.supervisors?.supervisorsList}/` + id, data);
    } else {
      return this.http?.post<any[]>(`${this.baseUrl}/${roots?.dashboard?.supervisors?.supervisorsList}`, data);
    }
  }
  deleteSupervisorId(id: number, data?: any): Observable<any> {
    let params = new HttpParams();
    if (data?.name) {
      params = params.append("name", data?.name);
    }
    return this.http?.delete<any>(`${this.baseUrl}/${roots?.dashboard?.supervisors?.supervisorsList}/` + id, { params: params });
  }
}
