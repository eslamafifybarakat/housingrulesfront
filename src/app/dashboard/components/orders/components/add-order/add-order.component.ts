import { OrdersService } from './../../../../services/orders.service';
import { patterns } from './../../../../../shared/configs/patternValidations';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { Router } from '@angular/router';
import { TanksService } from './../../../../services/tanks.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PublicService } from './../../../../../shared/services/public.service';
import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  tanksSize: any = [{ value: 0, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size13') },
  { value: 1, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size20') },
  { value: 2, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size32') }];
  isLoadingTanksSize: boolean = false;

  orderOriginList: any = [
    { id: 1, name: "By WhatsApp" },
    { id: 2, name: "By TMS" },
    { id: 3, name: "By Call" },
    { id: 4, name: "By Site" },
    { id: 5, name: "Other" },
  ]
  isLoadingOrderOrigin: boolean = false;

  propertyTypeList: any = [
    { id: 1, name: "Residential" },
    { id: 2, name: "Governmental" },
    { id: 3, name: "Commercial" },
  ]
  isLoadingPropertyType: boolean = false;
  constructor(
    public checkValidityService: CheckValidityService,
    private supervisorsService: SupervisorsService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private orderService: OrdersService,
    private cdr: ChangeDetectorRef,
    protected router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getAllSupervisors();

  }

  orderForm = this.fb?.group(
    {
      orderOrigin: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],

      district: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      propertyType: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      tankSize: [null, Validators?.required],
      customerName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      customerMobileNumber: ['', {
        validators: [
          Validators.required,
          Validators.pattern(patterns?.phone)], updateOn: "blur"
      }],
      supervisor: [null, {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      locationLink: ['', {
        validators: [
          Validators.required,
          Validators.pattern(patterns?.url)], updateOn: "blur"
      }],
      comment: ['', {
        validators: [
          Validators.required,
          Validators.minLength(3)], updateOn: "blur"
      }],
      active: [false, []]
    },
  );

  get formControls(): any {
    return this.orderForm?.controls;
  }
  getAllSupervisors(): any {
    this.isLoadingSupervisors = true;
    this.supervisorsService?.getSupervisorsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200) {
          res?.data ? res?.data?.forEach((supervisor: any) => {
            this.supervisorsList?.push({
              name: supervisor?.name,
              id: supervisor?.id
            });
          }) : '';
          this.isLoadingSupervisors = false;
        } else {
          res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
          this.isLoadingSupervisors = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSnackBar(err?.message) : '';
        this.isLoadingSupervisors = false;
      });
    this.cdr?.detectChanges();

    // this.supervisorsList = [
    //   { id: 1, name: "ali ahmed" },
    //   { id: 1, name: "ali ahmed" },
    //   { id: 33, name: "ali ahmed" },
    //   { id: 1, name: "ali ahmed" },
    //   { id: 1, name: "ali ahmed" },
    //   { id: 1, name: "ali ahmed" },
    // ]
  }
  submit(): void {
    const myObject: { [key: string]: any } = {};

    if (this.orderForm?.valid) {
      let formInfo: any = this.orderForm?.value;
      myObject['orderOrigin'] = formInfo?.orderOrigin?.['name'];
      myObject['propertyType'] = formInfo?.propertyType?.['name'];
      myObject['customerMobileNumber'] = formInfo?.customerMobileNumber;
      myObject['district'] = formInfo?.district;
      myObject['locationLink'] = formInfo?.locationLink;
      myObject['supervisorId'] = formInfo?.supervisor?.['id'];
      myObject['customerId'] = formInfo?.customerName;
      myObject['comments'] = formInfo?.comment;
      myObject['tankSize'] = formInfo?.tankSize?.['value'];

      myObject['createBy'] = 0;

      this.publicService?.show_loader?.next(true);
      this.orderService?.addOrUpdateOrder(myObject)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true && res?.statusCode == 200) {
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
      this.checkValidityService?.validateAllFormFields(this.orderForm);
    }
  }

  cancel(): void {

  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
