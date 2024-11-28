import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { patterns } from './../../../../../shared/configs/patternValidations';
import { CustomersService } from './../../../../services/customers.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CachingServiceService } from 'src/app/core/services/caching-service.service';
@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrls: ['./add-edit-customer.component.scss']
})
export class AddEditCustomerComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  isEdit: boolean = false;
  customerId: any;

  constructor(
    public checkValidityService: CheckValidityService,
    private customersService: CustomersService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    public fb: FormBuilder,
    private cashingService:CachingServiceService
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    if (this.modalData?.item?.id) {
      this.customerId = this.modalData?.item?.id;
    }
    this.isEdit = this.modalData?.type == 'edit' ? true : false;
    if (this.isEdit) {
      this.patchValue();
    }
  }

  modalForm = this.fb?.group(
    {
      isVip: [false, []],
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)]
      }],
      mobileNumber: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.phone)], updateOn: "blur"
      }],
    }, { updateOn: "blur" }
  );

  get formControls(): any {
    return this.modalForm?.controls;
  }
  patchValue(): void {
    console.log(this.modalData);
    this.modalForm?.patchValue({
      name: this.modalData?.item?.name,
      mobileNumber: this.modalData?.item?.mobileNumber,
      isVip: this.modalData?.item?.isVip
    })
  }

  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      myObject['name'] = this.modalForm?.value?.name;
      myObject['mobileNumber'] = this.modalForm?.value?.mobileNumber;
      myObject['isVip'] = this.modalForm?.value?.isVip;

      if (this.isEdit) {
        myObject['id'] = this.customerId;
        // myObject['lastModifiedBy'] = 0;
      } else {
        // myObject['createBy'] = 0;
      }
      this.publicService?.show_loader?.next(true);
      this.cashingService.setCachingEnabled(false)
      this.customersService?.addOrUpdateCustomer(myObject, this.customerId ? this.customerId : null)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true && res?.statusCode == 200) {
            this.ref.close({ listChanged: true, item: res?.data });
            this.publicService?.show_loader?.next(false);
            res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
          } else {
            res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
            this.publicService?.show_loader?.next(false);
          }
        },
        (err: any) => {
          err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
          this.publicService?.show_loader?.next(false);
        });
    } else {
      this.checkValidityService?.validateAllFormFields(this.modalForm);
    }
  }

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
