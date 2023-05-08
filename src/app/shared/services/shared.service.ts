import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService implements OnInit {
  showSideMenu = new BehaviorSubject<boolean>(false);
  urlData = new BehaviorSubject<boolean>(false);
  moduleType = new BehaviorSubject<string>('');
  activeStep = new BehaviorSubject<number>(1);
  show_loader = new Subject<boolean>();

  alphabet: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  constructor() {
  }

  ngOnInit(): void {

  }

  getLocationService(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(response => {
        resolve({
          lat: response.coords.latitude,
          lng: response.coords.longitude
        })
      })
    })
  }

  getLetter(index: any): any {
    return this.alphabet[index];
  }
}
