import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DriversService } from './../../../../services/drivers.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gate-details',
  templateUrl: './gate-details.component.html',
  styleUrls: ['./gate-details.component.scss']
})
export class GateDetailsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  settlementId: any;
  dateTime: any;
  time: any;
  propertyType: any;
  constructor(
    private driversService: DriversService,
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.settlementId = this.modalData?.id;
    this.dateTime = this.modalData?.dateTime;
    this.propertyType = this.modalData?.propertyType ? this.modalData?.propertyType[0]?.name : '';
    const date = new Date(this.dateTime);
    const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
    this.time = date.toLocaleString('en-US', options);
  }

  edit(): void {
    this.ref?.close();
    // this.router.navigate(['/dashboard/addOrder', { id: this.settlementId }]);
  }

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
