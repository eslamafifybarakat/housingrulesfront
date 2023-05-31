import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  isFullLoading: boolean = false;
  reportsCount: any = 7;
  reportsList: any = [];

  constructor(
    private reportsService: ReportsService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getReportsCategory();
  }

  getReportsCategory(): void {
    this.isFullLoading = true;
    this.reportsService?.getReportsCategory()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.reportsList = res?.data ? res?.data : null;
          this.isFullLoading = false;
        } else {
          res?.message ? this.alertsService.openSweetAlert('info', res?.message) : '';
          this.isFullLoading = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService.openSweetAlert('error', err?.message) : '';
        this.isFullLoading = false;
      });
    this.cdr?.detectChanges();

    this.reportsList = [
      { name: 'Order reports', id: 1, reports: [{ id: 1, name: 'تفاصيل الطلبات اليومية' }, { id: 2, name: 'عدد الطلبات الاجمال حسب الاحياء' }, { id: 3, name: 'تفاصيل الطلبات اليومية' }, { id: 4, name: 'عدد الطلبات الاجمال حسب الاحياء' }] },
      { name: 'Operations', id: 2, reports: [{ id: 4, name: 'Daily order details' }] },
      { name: 'Tankers', id: 3, reports: [{ id: 7, name: 'Total number of applications by district' }] },
      { name: ' Financial reports', id: 5, reports: [{ id: 8, name: 'Daily order details' }, { id: 10, name: 'Total number of applications by district' }] },
    ];

  }

  reportDetails(item: any): void {
    this.router?.navigate(['/dashboard/daily-order-details', { id: item?.id, name: item?.name }])
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
