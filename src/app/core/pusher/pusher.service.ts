import { BehaviorSubject } from 'rxjs';
import { keys } from './../../shared/configs/localstorage-key';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  newNotification = new BehaviorSubject<{}>({});
  pusher: any;

  userLoginData = JSON?.parse(window?.localStorage?.getItem(keys?.userLoginData) || "{}");

  constructor(private http: HttpClient) {
    setTimeout(() => {
      // this.pusher = new Pusher(environment.PUSHER_API_KEY, {
      //   cluster: environment.PUSHER_API_CLUSTER,
      //   forceTLS: true,
      //   // authEndpoint: environment.uri + `broadcasting/auth`,
      //   auth: {
      //     headers: {
      //       'Authorization': `Bearer ${this.userLoginData?.token}`
      //     }
      //   },
      // });
      const channel = this.pusher?.subscribe('my-channel');
      channel?.bind('notification_add', (data: any) => {
        this.newNotification?.next(data);
      });
    }, 5);
  }
}
