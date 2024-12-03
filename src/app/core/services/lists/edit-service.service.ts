import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditServiceService {
  private refreshSupervisorsSubject = new Subject<void>();
  private refreshDriversSubject = new Subject<void>();
  private refreshServiceAgentSubject = new Subject<void>();
  private refreshUserSubject = new Subject<void>();
  private refreshCustomersSubject = new Subject<void>();
  private refreshTanksSubject = new Subject<void>(); // تعريف خاص بـ tanks
  
  constructor() { }
  
  emitRefreshSupervisors() {
    this.refreshSupervisorsSubject.next();
  }
  
  emitRefreshDrivers() {
    this.refreshDriversSubject.next();
  }
  
  emitRefreshServiceAgent() {
    this.refreshServiceAgentSubject.next();
  }
  
  emitRefreshUsers() {
    this.refreshUserSubject.next();
  }
  
  emitRefreshCustomers() {
    this.refreshCustomersSubject.next(); 
  }
  
  emitRefreshTanks() {
    this.refreshTanksSubject.next(); 
  }
  
  getRefreshSupervisors() {
    return this.refreshSupervisorsSubject.asObservable();
  }
  
  getRefreshDrivers() {
    return this.refreshDriversSubject.asObservable();
  }
  
  getRefreshServiceAgent() {
    return this.refreshServiceAgentSubject.asObservable();
  }
  
  getRefreshUsers() {
    return this.refreshUserSubject.asObservable(); 
  }
  
  getRefreshCustomers() {
    return this.refreshCustomersSubject.asObservable(); 
  }
  
  getRefreshTanks() {
    return this.refreshTanksSubject.asObservable(); 
  }
  
}
