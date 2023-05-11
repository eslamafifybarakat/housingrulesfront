import { DriversService } from './../../../../services/drivers.service';
import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { patterns } from './../../../../../shared/configs/patternValidations';
import { OrdersService } from './../../../../services/orders.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  isEdit: boolean = false;
  orderId: any;
  orderData: any;
  isFullLoading: boolean = false;

  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  driversList: any = [];
  isLoadingDrivers: boolean = false;

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
    private activatedRoute: ActivatedRoute,
    private driversService: DriversService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private orderService: OrdersService,
    private cdr: ChangeDetectorRef,
    protected router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.params['id'];
    this.isEdit = this.orderId ? true : false;
    if (this.isEdit) {
      this.getOrderData(this.orderId);
    } else {
      this.getAllSupervisors();
    }
  }

  orderForm = this.fb?.group(
    {
      orderNumber: ['', {
        validators: [], updateOn: "blur"
      }],
      paymentMethod: ['', {
        validators: [], updateOn: "blur"
      }],
      paidAmount: ['', {
        validators: [], updateOn: "blur"
      }],
      driver: ['', {
        validators: [], updateOn: "blur"
      }],
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
          if (this.isEdit) {
            this.supervisorsList?.forEach((supervisor: any) => {
              if (supervisor?.id == this.orderData?.supervisorId) {
                this.orderForm?.patchValue({
                  supervisor: supervisor
                })
              }
            });
          }
          this.isLoadingSupervisors = false;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoadingSupervisors = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoadingSupervisors = false;
      });
    this.cdr?.detectChanges();

    this.supervisorsList = [
      { id: 1, name: "ali ahmed" },
      { id: 1, name: "ali ahmed" },
      { id: 33, name: "ali ahmed" },
      { id: 1, name: "ali ahmed" },
      { id: 1, name: "ali ahmed" },
      { id: 11, name: "ali ahmed" },
    ]
    if (this.isEdit) {
      this.supervisorsList?.forEach((supervisor: any) => {
        if (supervisor?.id == this.orderData?.supervisorId) {
          this.orderForm?.patchValue({
            supervisor: supervisor
          })
        }
      });
    }
  }
  getAllDrivers(): any {
    this.isLoadingDrivers = true;
    this.driversService?.getDriversList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200) {
          res?.data ? res?.data?.forEach((item: any) => {
            this.driversList?.push({
              name: item?.name,
              id: item?.id
            });
          }) : '';
          if (this.isEdit) {
            this.driversList?.forEach((driver: any) => {
              if (driver?.id == this.orderData?.driverId) {
                this.orderForm?.patchValue({
                  driver: driver
                })
              }
            });
          }
          this.isLoadingDrivers = false;
        } else {
          res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
          this.isLoadingDrivers = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSnackBar(err?.message) : '';
        this.isLoadingDrivers = false;
      });
    this.cdr?.detectChanges();

    this.driversList = [
      { id: 1, name: 'tank1' },
      { id: 2, name: 'tank1' },
      { id: 21, name: 'tank1' },
      { id: 33, name: 'tank1' },
    ];
    if (this.isEdit) {
      this.driversList?.forEach((driver: any) => {
        if (driver?.id == this.orderData?.driverId) {
          this.orderForm?.patchValue({
            driver: driver
          })
        }
      });
    }
  }
  getOrderData(id: number): void {
    this.isFullLoading = true;
    this.orderService?.getOrderById(id)?.subscribe(
      (res: any) => {
        // if (res?.statusCode == 200) {
        //   this.orderData = res?.data ? res?.data : null;
        //   this.getAllSupervisors();
        //   this.getAllDrivers();
        //   this.patchValue();
        //   this.isFullLoading = false;
        // } else {
        //   res?.message ? this.alertsService.openSweetAlert('info', res?.message) : '';
        //   this.isFullLoading = false;
        // }
      },
      (err: any) => {
        err?.message ? this.alertsService.openSweetAlert('error', err?.message) : '';
        this.isFullLoading = false;
      });
    this.cdr.detectChanges();

    this.orderData = { date: new Date(), id: 1, order_number: '765-776-7', orderOrigin: { id: 4, name: "By Site" }, propertyType: { id: 2, name: "Governmental" }, district: 'district', tankSize: 77, customer: 'Marwan ali', customerMobileNumber: 87444447, locationLink: 'Location Link', paymentMethod: 'Cash', paidAmount: 300, cancellationCauses: 'cancellationCauses', closedAt: new Date(), supervisorId: 11, driverId: 33, status: 'cancelled', tankSizeVal: 1, comment: 'jjjjjjj', orderNumber: 7777 },

      this.getAllSupervisors();
    this.getAllDrivers();
    this.patchValue();
  }
  patchValue(): void {
    console.log(this.orderData);
    this.tanksSize?.forEach((element: any) => {
      if (element?.value == this.orderData?.tankSizeVal) {
        this.orderForm?.patchValue({
          tankSize: element
        })
      }
    });

    this.orderForm?.patchValue({
      orderOrigin: this.orderData?.orderOrigin,
      propertyType: this.orderData?.propertyType,
      customerMobileNumber: this.orderData?.customerMobileNumber,
      district: this.orderData?.district,
      locationLink: this.orderData?.locationLink,
      comment: this.orderData?.comment,
      orderNumber: this.orderData?.orderNumber,
      paidAmount: this.orderData?.paidAmount,
      paymentMethod: this.orderData?.paymentMethod,
      customerName: this.orderData?.customerName,
    })
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
      if (this.isEdit) {
        myObject['paidAmount'] = formInfo?.paidAmount;
        myObject['paymentMethod'] = formInfo?.paymentMethod;
        myObject['orderNumber'] = formInfo?.orderNumber;
      }

      this.publicService?.show_loader?.next(true);
      this.orderService?.addOrUpdateOrder(myObject, this.orderId ? this.orderId : null)?.subscribe(
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
