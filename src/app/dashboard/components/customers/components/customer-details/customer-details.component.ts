import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AddEditCustomerComponent } from '../add-edit-customer/add-edit-customer.component';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddEditAddressedPlacesComponent } from '../add-edit-customer/components/add-edit-addressed-places/add-edit-addressed-places.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  id: any;

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
    this.id = this.modalData?.id;
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
  addOrEditItem(id?: any, type?: any): void {
    this.router?.navigate([`/dashboard/add-edit-customer/${id}`])
    this.cancel();
    // const ref = this.dialogService?.open(AddEditAddressedPlacesComponent, {
    //   data: {
    //     item,
    //     type: type == 'edit' ? 'edit' : 'add',
    //     customerId: item?.id,
    //   },
    //   header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.addresses.editAddress') : this.publicService?.translateTextFromJson('dashboard.addresses.addAddress'),
    //   dismissableMask: false,
    //   width: '40%',
    //   styleClass: 'custom_modal'
    // });
    // ref.onClose.subscribe((res: any) => {
    //   if (res?.listChanged) {
    //     // this.getAddressById(item?.id, false);
    //   }
    // });
  }

  cancel(): void {
    this.ref.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
