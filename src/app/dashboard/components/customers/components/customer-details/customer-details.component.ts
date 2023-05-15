import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AddEditCustomerComponent } from '../add-edit-customer/add-edit-customer.component';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
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
    const ref = this.dialogService?.open(AddEditCustomerComponent, {
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
