import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CheckValidityService } from 'src/app/shared/services/check-validity/check-validity.service';
import { AlertsService } from 'src/app/core/services/alerts/alerts.service';
import { PublicService } from 'src/app/shared/services/public.service';
import { AddEditCustomerComponent } from '../../../add-edit-customer.component';
import { PlaceType } from 'src/app/enums';
import { AddEditAddressedPlacesComponent } from '../add-edit-addressed-places.component';
@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss']
})
export class AddressDetailsComponent implements OnInit {

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
    const ref = this.dialogService?.open(AddEditAddressedPlacesComponent, {
      data: {
        item: this.modalData,
        type: 'edit'
      },
      header: this.publicService?.translateTextFromJson('dashboard.addresses.editAddress'),
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


