import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { AddEditTankComponent } from './../add-edit-tank/add-edit-tank.component';
import { PublicService } from './../../../../../shared/services/public.service';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TanksService } from './../../../../services/tanks.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tank-details',
  templateUrl: './tank-details.component.html',
  styleUrls: ['./tank-details.component.scss']
})
export class TankDetailsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  tankId: any;

  constructor(
    public checkValidityService: CheckValidityService,
    private dialogService: DialogService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    protected router: Router,
  ) { }


  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.tankId = this.modalData?.id;
  }

  edit(): void {
    this.ref?.close();
    const ref = this.dialogService?.open(AddEditTankComponent, {
      data: {
        item: this.modalData,
        type: 'edit'
      },
      header: this.publicService?.translateTextFromJson('dashboard.tanks.editTank'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
  }

  cancel(): void {
    this.ref.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
