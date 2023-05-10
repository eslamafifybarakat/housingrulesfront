import { AddEditDriverComponent } from '../add-edit-driver/add-edit-driver.component';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PublicService } from './../../../../../shared/services/public.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { DriversService } from './../../../../services/drivers.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  driverId: any;

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
    this.driverId = this.modalData?.id;
  }

  submit(): void {
    // if (this.driverId) {
    //   let data = {
    //     name: this.modalData?.name,
    //     driver_status: this.modalData?.driver_status
    //   }
    //   this.driversService?.addOrUpdateDriver(data, this.driverId ? this.driverId : null)?.subscribe(
    //     (res: any) => {
    //       if (res?.code == 200) {
    //         this.ref.close({ listChanged: true });
    //         this.publicService?.show_loader?.next(false);
    //       } else {
    //         res?.message ? this.alertsService.openSnackBar(res?.message) : '';
    //         this.publicService?.show_loader?.next(false);
    //       }
    //     },
    //     (err: any) => {
    //       err?.message ? this.alertsService.openSnackBar(err?.message) : '';
    //       this.publicService?.show_loader?.next(false);
    //     });
    // }
    this.ref?.close();
    const ref = this.dialogService?.open(AddEditDriverComponent, {
      data: {
        item: this.modalData,
        type: 'edit'
      },
      header: this.publicService?.translateTextFromJson('dashboard.drivers.editDriver'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom_modal'
    });
  }

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
