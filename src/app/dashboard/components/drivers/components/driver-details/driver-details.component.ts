import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AddEditDriverComponent } from '../add-edit-driver/add-edit-driver.component';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DriversService } from './../../../../services/drivers.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditServiceService } from 'src/app/core/services/lists/edit-service.service';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  driverId: any;
  tankName: any = '';
  supervisorName: any = '';
  constructor(
    private driversService: DriversService,
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    private editService:EditServiceService
  ) { }


  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.driverId = this.modalData?.id;
    this.tankName = this.modalData?.tanks?.[0]?.name;
    this.supervisorName = this.modalData?.supervisors?.[0]?.name;
  }

  edit(): void {
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
    ref.onClose.subscribe(() => {
      // Emit an event to refresh the drivers list
      this.editService.emitRefreshDrivers();
    });
  }

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
