import { TankSize } from './../../../../../enums';
import { AddEditCustomerComponent } from '../../../customers/components/add-edit-customer/add-edit-customer.component';
import { CheckValidityService } from '../../../../../shared/services/check-validity/check-validity.service';
import { ConfirmCompleteOrderComponent } from '../confirm-complete-order/confirm-complete-order.component';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { AlertsService } from '../../../../../core/services/alerts/alerts.service';
import { PublicService } from '../../../../../shared/services/public.service';
import { patterns } from '../../../../../shared/configs/patternValidations';
import { TanksService } from 'src/app/dashboard/services/tanks.service';
import { DriversService } from '../../../../services/drivers.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrdersService } from '../../../../services/orders.service';
import { keys } from 'src/app/shared/configs/localstorage-key';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CustomersService } from 'src/app/dashboard/services/customers.service';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.scss']
})
export class AddEditOrderComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  userData: any;
  isEdit: boolean = false;
  orderId: any;
  orderData: any;
  isFullLoading: boolean = false;

  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  driversList: any = [];
  isLoadingDrivers: boolean = false;

  // tanksList: any = [];
  isSaving: boolean = false;

  paymentMethodsList: any = [
    { id: 1, value: 1, name: "Cash" },
    { id: 2, value: 2, name: "Mada" },
    { id: 3, value: 3, name: "Transfer" },
    { id: 4, value: 4, name: "Credit" }
  ]
  isLoadingPaymentMethods: boolean = false;

  orderOriginList: any = [];
  isLoadingOrderOrigin: boolean = false;

  propertyTypeList: any = [];
  isLoadingPropertyType: boolean = false;

  districtsList: any = [];
  isLoadingDistricts: boolean = false;
  customersList: any = [];
  isLoadingCustomers: boolean = false;

  currLang: any = '';
  tanksSize: any = [{ value: 1, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size15') },
  { value: 2, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size20') },
  { value: 3, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size32') }];
  isLoadingTanksSize: boolean = false;
  customerCanSubmitOrder: boolean = true;

  constructor(
    public checkValidityService: CheckValidityService,
    private supervisorsService: SupervisorsService,
    private activatedRoute: ActivatedRoute,
    private driversService: DriversService,
    private dialogService: DialogService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private orderService: OrdersService,
    private tanksService: TanksService,
    private customersService: CustomersService,
    private cdr: ChangeDetectorRef,
    protected router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.orderOriginList = this.publicService.getOrderOrigin();
    this.propertyTypeList = this.publicService.getPropertyType();
    this.currLang = window.localStorage.getItem(keys?.language);
    // this.districtsList = this.publicService?.getDistricts();
    this.userData = JSON.parse(window.localStorage.getItem(keys?.userLoginData) || '{}');
    if (this.isEdit && (this.userData?.userType == 2 || this.userData?.userType == 4)) {
      this.publicService?.addValidators(this.orderForm, ['driver']);
    } else {
      this.publicService?.removeValidators(this.orderForm, ['driver']);
    }
    if (this.isEdit && this.userData?.userType == 7) {
      this.publicService?.addValidators(this.orderForm, ['paidAmount']);
      this.publicService?.addValidators(this.orderForm, ['paymentMethod']);
    } else {
      this.publicService?.removeValidators(this.orderForm, ['paidAmount']);
      this.publicService?.removeValidators(this.orderForm, ['paymentMethod']);
    }
    this.orderId = this.activatedRoute.snapshot.params['id'];
    this.isEdit = this.orderId ? true : false;
    this.orderForm?.controls?.supervisor?.disable();
    this.orderForm?.controls?.driver?.disable();
    if (this.isEdit) {
      this.getOrderData(this.orderId);
    } else {
      // this.getAllSupervisors();
      this.getAllCustomers();
      // this.getAllDrivers();
      this.getAllDistricts();
      //this.getAllTanks();
    };
    // if (!this.orderForm?.value?.district) {
    //   this.orderForm?.patchValue({
    //     supervisor: null,
    //     driver: null
    //   });
    // }
  }

  orderForm = this.fb?.group(
    {
      orderNumber: ['', {
        validators: [], updateOn: "blur"
      }],
      paidAmount: ['', {
        validators: [], updateOn: "blur"
      }],
      paymentMethod: ['', {
        validators: [], updateOn: "blur"
      }],
      driver: [null, {
        validators: []
      }],
      orderOrigin: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],

      district: [null, {
        validators: [
          Validators.required,
          Validators?.minLength(3)]
      }],
      propertyType: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      tankSize: ['', {
        validators: [
          Validators.required]
      }],
      tankPrice: [0, []],
      customerName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)]
      }],
      customerMobileNumber: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      supervisor: [null, {
        validators: [
          Validators.required]
      }],
      locationLink: ['', {
        validators: [
          // Validators.required,
          Validators.pattern(patterns?.url)], updateOn: "blur"
      }],
      comment: ['', {
        validators: [
          Validators.minLength(3)], updateOn: "blur"
      }],
      active: [false, []],
      isVip: [false, []]
    },
  );
  get formControls(): any {
    return this.orderForm?.controls;
  }

  getAllDistricts(): any {
    this.isLoadingDistricts = true;
    this.orderService?.getDistrictsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.districtsList = res?.data[0]?.districts;
          if (this.isEdit) {
            this.districtsList?.forEach((item: any) => {
              if (item?.id == this.orderData?.districtId) {
                this.orderForm?.patchValue({
                  district: item
                })
              }
            });
            this.orderForm?.controls?.supervisor?.enable();
            this.getSupervisorsByDistrictId(this.orderData?.districtId);
          }
          this.isLoadingDistricts = false;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoadingDistricts = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoadingDistricts = false;
      });
    this.cdr?.detectChanges();
  }
  onChangeDistrict(item: any): void {
    if (item?.value?.id) {
      this.getSupervisorsByDistrictId(item?.value?.id);
      this.orderForm?.patchValue({
        supervisor: null
      });
      this.orderForm?.controls?.supervisor?.enable();
    }
  }
  onClearDistrict(): void {
    this.orderForm?.patchValue({
      supervisor: null,
      driver: null
    });
    this.supervisorsList = [];
    this.driversList = [];

    this.orderForm?.controls?.supervisor?.disable();
    this.orderForm?.controls?.driver?.disable();
  }

  onChangeSupervisor(item: any): void {
    if (item?.value?.id) {
      this.getDriversBysuperVisorId(item?.value?.id);
      this.orderForm?.patchValue({
        driver: null
      });
      this.orderForm?.controls?.driver?.enable();
    }
  }
  onClearSupervisor(): void {
    this.orderForm?.patchValue({
      driver: null
    });
    this.driversList = [];
    this.orderForm?.controls?.driver?.disable();
  }

  getAllCustomers(): any {
    this.isLoadingCustomers = true;
    this.orderService?.getCustomersList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.customersList = res?.data;
          if (this.isEdit) {
            this.customersList?.forEach((item: any) => {
              if (item?.id == this.orderData?.customerId) {
                this.orderForm?.patchValue({
                  customerName: item
                })
              }
            });
          }
          this.isLoadingCustomers = false;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoadingCustomers = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoadingCustomers = false;
      });
    this.cdr?.detectChanges();
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
  addNewCustomer(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditCustomerComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.customers.editCustomer') : this.publicService?.translateTextFromJson('dashboard.customers.addCustomer'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.customersList.push(res?.item);
        this.orderForm?.patchValue({
          customerName: res?.item,
          customerMobileNumber: res?.item?.mobileNumber
        });
        this.cdr?.detectChanges();
      }
    });
  }

  onSelectCustomer(): void {
    let formInfo: any = this.orderForm?.value?.customerName;
    this.customerCanSubmitOrder = true;

    this.orderForm?.patchValue({
      customerMobileNumber: formInfo?.mobileNumber
    });
    // this.customersService.canCustomerSubmitOrder(formInfo.id).subscribe(
    //   (res: any) => {
    //     if (res?.isSuccess == true && res?.statusCode == 200) {
    //       this.publicService?.show_loader?.next(false);
    //       if (res?.data == false){
    //         this.customerCanSubmitOrder = false;
    //       }
    //     } else {
    //       res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
    //       this.publicService?.show_loader?.next(false);
    //     }
    //     this.isSaving = false;
    //   },
    //   (err: any) => {
    //     err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
    //     this.publicService?.show_loader?.next(false);
    //     this.isSaving = false;

    //   });
  }
  onClearCustomer(): void {
    this.orderForm?.patchValue({
      customerMobileNumber: null
    });
    this.customerCanSubmitOrder = true;

  }

  getSupervisorsByDistrictId(districtId: any): any {
    this.isLoadingSupervisors = true;
    this.supervisorsService?.getSupervisorsByDistrictId(districtId)?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          let arr: any = [];
          res?.data ? res?.data?.forEach((supervisor: any) => {
            arr?.push({
              name: supervisor?.arName,
              id: supervisor?.id
            });
          }) : '';
          this.supervisorsList = arr;
          if (this.isEdit) {
            this.supervisorsList?.forEach((supervisor: any) => {
              if (supervisor?.id == this.orderData?.supervisorId) {
                this.orderForm?.patchValue({
                  supervisor: supervisor
                });
                this.isLoadingSupervisors = false;
                this.orderForm?.controls?.driver?.enable();
                this.getDriversBysuperVisorId(this.orderData?.supervisorId);
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
    if (this.isEdit) {
      this.supervisorsList?.forEach((supervisor: any) => {
        if (supervisor?.id == this.orderData?.supervisorId) {
          this.orderForm?.patchValue({
            supervisor: supervisor
          });
        }
      });
    }
  }
  getDriversBysuperVisorId(superVisorId: any): any {
    if (this.isEdit && (this.userData?.userType == 2 || this.userData?.userType == 4)) {
      this.isLoadingDrivers = true;
      this.driversService?.getDriversBysuperVisorId(superVisorId)?.subscribe(
        (res: any) => {
          if (res?.statusCode == 200 && res?.isSuccess == true) {
            let arr: any = [];
            res?.data ? res?.data?.forEach((item: any) => {
              arr?.push({
                name: item?.arName,
                id: item?.id
              });
            }) : '';
            this.driversList = arr;
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
  }
  // getAllTanks(): any {
  //   this.isLoadingTanks = true;
  //   this.tanksService?.getTanksList()?.subscribe(
  //     (res: any) => {
  //       if (res?.statusCode == 200 && res?.isSuccess == true) {
  //         res?.data ? res?.data?.forEach((tank: any) => {
  //           let sizeTank: any;
  //           if (tank?.tankSize == 0) {
  //             sizeTank = "Size13";
  //           }
  //           if (tank?.tankSize == 1) {
  //             sizeTank = "Size20";
  //           }
  //           if (tank?.tankSize == 2) {
  //             sizeTank = "Size32";
  //           }
  //           let tankSize= this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.' + sizeTank)
  //           this.tanksList?.push({
  //             price: tank?.price,
  //             name:  tankSize + " - " + tank?.name ,
  //             id: tank?.id
  //           });
  //         }) : '';
  //         if (this.isEdit) {
  //           this.tanksList?.forEach((tank: any) => {
  //             if (tank?.id == this.orderData?.tankId) {
  //               this.onTankChange(tank);
  //               this.orderForm?.patchValue({
  //                 tank: tank
  //               })
  //             }
  //           });
  //         }
  //         this.isLoadingTanks = false;
  //       } else {
  //         res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
  //         this.isLoadingTanks = false;
  //       }
  //     },
  //     (err: any) => {
  //       err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
  //       this.isLoadingTanks = false;
  //     });
  //   this.cdr?.detectChanges();
  // }
  onTankChange(item: any): void {
    let price: any = 0;
    switch (item.value) {
      case 1:
        price = 80;
        break;
      case 2:
        price = 110;
        break;
      case 3:
        price = 176;
        break;
    }
    this.orderForm?.patchValue({
      tankPrice: price
    });
  }
  onTankClear(): void {
    this.orderForm?.patchValue({
      tankPrice: null
    });
  }

  getOrderData(id: number): void {
    this.isFullLoading = true;
    this.orderService?.getOrderById(id)?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.orderData = res?.data ? res?.data : null;
          // this.getAllSupervisors();
          this.getAllCustomers();
          // this.getAllDrivers();
          this.getAllDistricts();
          // this.getAllTanks();
          this.patchValue();
          this.isFullLoading = false;
        } else {
          res?.message ? this.alertsService.openSweetAlert('info', res?.message) : '';
          this.isFullLoading = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService.openSweetAlert('error', err?.message) : '';
        this.isFullLoading = false;
      });
    this.cdr?.detectChanges();
  }
  patchValue(): void {
    let orderOrigin: any;
    this.orderOriginList?.forEach((item: any) => {
      if (item?.value == this.orderData?.orderOrigin) {
        orderOrigin = item
      }
    });
    // let district: any;
    // this.districtsList?.forEach((item: any) => {
    //   if (item?.value == this.orderData?.district) {
    //     district = item
    //   }
    // });
    let propertyType: any;
    this.propertyTypeList?.forEach((item: any) => {
      if (item?.value == this.orderData?.propertyType) {
        propertyType = item
      }
    });
    let paymentMethod: any;
    this.paymentMethodsList?.forEach((item: any) => {
      if (item?.value == this.orderData?.paymentMethod) {
        paymentMethod = item
      }
    });
    this.tanksSize?.forEach((element: any) => {
      if (element?.value == this.orderData?.tankSize) {
        this.orderForm?.patchValue({
          tankSize: element
        })
      }
    });
    this.orderForm?.patchValue({
      orderOrigin: orderOrigin,
      propertyType: propertyType,
      customerMobileNumber: this.orderData?.customerMobileNumber,
      // district: district ? district : 1,
      locationLink: this.orderData?.locationLink,
      comment: this.orderData?.comments,
      orderNumber: this.orderData?.orderNumber,
      paidAmount: this.orderData?.paidAmount,
      paymentMethod: paymentMethod,
      isVip: this.orderData?.isVip
    })
  }

  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.orderForm?.valid) {
      this.isSaving = true;
      let date: Date = new Date();
      let formInfo: any = this.orderForm?.value;
      myObject['dateTime'] = date;
      myObject['orderOrigin'] = formInfo?.orderOrigin?.['value'];
      myObject['propertyType'] = formInfo?.propertyType?.['value'];
      myObject['customerMobileNumber'] = formInfo?.customerMobileNumber;
      myObject['districtId'] = formInfo?.district?.['id'];
      myObject['locationLink'] = formInfo?.locationLink;
      myObject['supervisorId'] = formInfo?.supervisor?.['id'];
      myObject['driverId'] = formInfo?.driver?.id;
      myObject['customerId'] = formInfo?.customerName?.id;
      myObject['comments'] = formInfo?.comment;
      myObject['tankSize'] = formInfo?.tankSize.value;
      myObject['paymentMethod'] = formInfo?.paymentMethod?.['value'];
      myObject['isVip'] = formInfo?.isVip;

      if (this.isEdit) {
        myObject['id'] = this.orderId;
        if (this.userData?.userType == 7) {
          myObject['paidAmount'] = formInfo?.paidAmount;
        }
        // myObject['orderNumber'] = formInfo?.orderNumber;
        // myObject['lastModifiedBy'] = 0;
      } else {
        // myObject['createBy'] = 0;
      }

      if (this.isEdit && this.userData?.userType == 7) {
        this.publicService?.show_loader?.next(true);
        this.orderService?.addOrUpdateOrderDriverArrivedAtStation(myObject, this.orderId ? this.orderId : null)?.subscribe(
          (res: any) => {
            if (res?.isSuccess == true && res?.statusCode == 200) {
              this.publicService?.show_loader?.next(false);
              res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
              this.router.navigate(['/dashboard/orders'])
            } else {
              res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
              this.publicService?.show_loader?.next(false);
            }
          },
          (err: any) => {
            err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
            this.publicService?.show_loader?.next(false);
          });
      } else if (this.isEdit && this.userData?.userType == 8) {
        const ref = this.dialogService.open(ConfirmCompleteOrderComponent, {
          header: this.publicService?.translateTextFromJson('general.confirm_order'),
          dismissableMask: false,
          width: '35%',
        });
        ref.onClose.subscribe((res: any) => {
          if (res?.confirmed) {
            this.publicService?.show_loader?.next(true);
            this.orderService?.addOrUpdateOrderComplete(myObject, this.orderId ? this.orderId : null)?.subscribe(
              (res: any) => {
                if (res?.isSuccess == true && res?.statusCode == 200) {
                  this.publicService?.show_loader?.next(false);
                  res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
                  this.router.navigate(['/dashboard/orders']);
                } else {
                  res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
                  this.publicService?.show_loader?.next(false);
                }
              },
              (err: any) => {
                err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
                this.publicService?.show_loader?.next(false);
              });
          }
        });
      } else {
        this.orderService?.addOrUpdateOrder(myObject, this.orderId ? this.orderId : null)?.subscribe(
          (res: any) => {
            if (res?.isSuccess == true && res?.statusCode == 200) {
              this.publicService?.show_loader?.next(false);
              res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
              this.router.navigate(['/dashboard/orders']);
            } else {
              res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
              this.publicService?.show_loader?.next(false);
            }
            this.isSaving = false;
          },
          (err: any) => {
            err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
            this.publicService?.show_loader?.next(false);
            this.isSaving = false;

          });
      }
    } else {
      this.checkValidityService?.validateAllFormFields(this.orderForm);
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/orders']);
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
