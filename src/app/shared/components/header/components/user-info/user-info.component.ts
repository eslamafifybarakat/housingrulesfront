import { AuthUserService } from './../../../../../auth/services/auth-user.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { userInfoMenu } from './userInfoMenu';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoading: boolean = false;
  userData: any;
  collapse: boolean = false;
  userInfoList: any = [];

  constructor(
    public authUserService: AuthUserService,
    public alertsService: AlertsService,
    public cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userInfoList = userInfoMenu;
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}

