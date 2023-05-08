import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  unreadedNotification: number = 3;
  collapse: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
