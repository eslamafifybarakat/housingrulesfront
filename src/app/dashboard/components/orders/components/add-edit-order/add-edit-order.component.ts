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
import { catchError, finalize, Subscription } from 'rxjs';
import { CustomersService } from 'src/app/dashboard/services/customers.service';
import { ConfirmationService } from 'primeng/api';
import { AddCustomerModalComponent } from '../../../customers/components/add-edit-customer/components/add-customer-modal/add-customer-modal.component';
import { setOrRemoveCacheRequestURL } from 'src/app/common/interceptors/caching/caching.utils';
import { environment } from 'src/environments/environment';
import { roots } from 'src/app/shared/configs/endPoints';
import { updateItemName } from 'src/app/common/functions/fixNames';
import { applyAddOrRemoveCacheRequest } from 'src/app/common/storages/session-storage..Enum';

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
  AllSupervisorsList: any = [];
  filteredSupervisorsList: any = [];

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

  urlsToRemove: string[] = [
    // `${environment.apiUrl}/${roots.dashboard.orders.checkCustomerHasOpendedOrders}`,
    // `${environment.apiUrl}/${roots.dashboard.orders.confirmSettlementeOrderList}`,
    // `${environment.apiUrl}/${roots.dashboard.orders.orderDriverArrivedToStationList}`,
    // `${environment.apiUrl}/${roots.dashboard.orders.ordersByTypeList}`,
    // `${environment?.apiUrl}/${roots?.dashboard?.supervisors.supervisorsList}`,
    // `${environment?.apiUrl}/${roots?.dashboard?.customers.customersList}`,
    // `${environment?.apiUrl}/${roots?.dashboard?.customers.customersShortList}`,
    // `${environment?.apiUrl}/${roots?.dashboard?.districtsList}`,
  ];

  constructor(
    public checkValidityService: CheckValidityService,
    private supervisorsService: SupervisorsService,
    private confirmationService: ConfirmationService,
    private customersService: CustomersService,
    private activatedRoute: ActivatedRoute,
    private driversService: DriversService,
    private dialogService: DialogService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private orderService: OrdersService,
    private tanksService: TanksService,
    private cdr: ChangeDetectorRef,
    protected router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.orderOriginList = this.publicService.getOrderOrigin();
    this.propertyTypeList = this.publicService.getPropertyType();

    this.currLang = window.localStorage.getItem(keys?.language);
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
      this.getAllSupervisors();
      this.getAllCustomers();
      this.getAllDistricts();
    }
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
      active: [false, []]
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
          this.getAllSupervisors();
          this.districtsList = res?.data;
          this.districtsList.forEach((item: any) => {
            updateItemName(item, item.arName, item.enName);
          });

          if (this.isEdit && this.orderData?.districtId) {
            const selectedDistrict = this.districtsList.find((item: any) => item?.id === this.orderData?.districtId);
            if (selectedDistrict) {
              this.orderForm?.patchValue({ district: selectedDistrict });
            }
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
    this.filteredSupervisorsList = [];
    if (item?.value?.id) {
      this.filteredSupervisorsList = this.AllSupervisorsList?.data
        .filter((ele: any) => ele?.districtIds?.includes(item?.value?.id))
        .map((supervisor: any) => ({
          arName: supervisor?.arName,
          enName: supervisor?.enName,
          id: supervisor?.id
        }));
      this.orderForm?.patchValue({
        supervisor: null
      });
      this.orderForm?.controls?.supervisor?.enable();
    } else {
      this.alertsService?.openSweetAlert('warning', 'يرجى اختيار الحي أولاً');
      this.orderForm?.controls?.supervisor?.disable();
    }
  }

  onClearDistrict(): void {
    this.orderForm?.patchValue({
      supervisor: null,
      driver: null
    });
    this.supervisorsList = [];
    this.driversList = [];
    this.filteredSupervisorsList = [];

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
        if (res?.isSuccess == true && res?.statusCode == 200) {
          this.customersList = res?.data;
          if (this.isEdit && this.orderData?.customerId) {
            this.customersList?.forEach((customer: any) => {
              if (customer?.id == this.orderData?.customerId) {
                this.orderForm?.patchValue({
                  customerName: customer
                });
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
    const ref = this.dialogService?.open(AddCustomerModalComponent, {
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
    // formInfo?.id ? this.checkCustomerHasOpendedOrders(formInfo?.id) : '';
  }
  onClearCustomer(): void {
    this.orderForm?.patchValue({
      customerMobileNumber: null
    });
    this.customerCanSubmitOrder = true;

  }
  checkCustomerHasOpendedOrders(id: any): void {
    this.isLoadingCustomers = true;
    this.orderService.checkCustomerHasOpendedOrders(id).subscribe(
      (res: any) => {
        if (res?.isSuccess == true && res?.statusCode == 200) {
          if (res?.data?.length > 0) {
            this.alertsService?.openSweetAlert('info', this.publicService.translateTextFromJson('general.hasOpendedOrders'));
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
  }

  getAllSupervisors(districtId?: any): any {
    this.isLoadingSupervisors = true;
    this.supervisorsService?.getSupervisorsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode === 200 && res?.isSuccess) {
          this.AllSupervisorsList = res;
          this.filteredSupervisorsList = res?.data
            ?.filter((ele: any) => !districtId || ele?.districtIds?.includes(districtId))
            .map((supervisor: any) => ({
              arName: supervisor?.arName,
              enName: supervisor?.enName,
              id: supervisor?.id,
            }));

          if (this.isEdit && this.orderData?.supervisorId) {
            this.orderForm?.controls?.supervisor?.enable();
            const selectedSupervisor = this.filteredSupervisorsList.find(
              (supervisor: any) => String(supervisor?.id) === String(this.orderData?.supervisorId) // Ensure type consistency
            );

            if (selectedSupervisor) {
              this.orderForm?.patchValue({
                supervisor: selectedSupervisor,
              });
              this.orderForm?.controls?.driver?.enable();
              this.getDriversBysuperVisorId(selectedSupervisor?.id); // Load drivers for the selected supervisor
            }
          }

          this.isLoadingSupervisors = false;
          this.cdr.detectChanges(); // Ensure the UI updates
        } else {
          this.alertsService?.openSweetAlert('info', res?.message || 'Failed to fetch supervisors');
          this.isLoadingSupervisors = false;
        }
      },
      (err: any) => {
        this.alertsService?.openSweetAlert('error', err?.message || 'Error fetching supervisors');
        this.isLoadingSupervisors = false;
      }
    );
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
          this.patchValue();
          this.getAllCustomers();
          this.getAllDistricts();
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
        });
        this.onTankChange(element);
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
      paymentMethod: paymentMethod
    })
  }

  // Start Submit Functions
  submit(): void {
    if (!this.orderForm?.valid) {
      this.checkValidityService?.validateAllFormFields(this.orderForm);
      return;
    }

    const myObject: any = this.buildOrderObject();
    this.isSaving = true;

    if (myObject.customerId) {
      this.publicService?.show_loader?.next(true);
      this.orderService
        .checkCustomerHasOpendedOrders(myObject.customerId)
        .pipe(
          finalize(() => this.publicService?.show_loader?.next(false)),
          catchError((err: any) => {
            this.handleError(err);
            throw err;
          })
        )
        .subscribe((res: any) => {
          if (res?.isSuccess && res?.statusCode === 200) {
            if (res?.data?.length > 0) {
              this.handleCustomerWithOpenOrders(myObject);
            } else {
              this.handleNoOpenOrders(myObject);
            }
          } else {
            this.alertWithResponseMessage(res?.message, 'info');
          }
        });
    }
  }

  private buildOrderObject(): { [key: string]: any } {
    const formInfo: any = this.orderForm?.value;
    const date = new Date();

    const myObject: { [key: string]: any } = {
      dateTime: date,
      orderOrigin: formInfo?.orderOrigin?.value,
      propertyType: formInfo?.propertyType?.value,
      customerMobileNumber: formInfo?.customerMobileNumber,
      districtId: formInfo?.district?.id,
      locationLink: formInfo?.locationLink,
      supervisorId: formInfo?.supervisor?.id,
      driverId: formInfo?.driver?.id,
      customerId: formInfo?.customerName?.id,
      comments: formInfo?.comment,
      tankSize: formInfo?.tankSize?.value,
      paymentMethod: formInfo?.paymentMethod?.value,
    };

    if (this.isEdit) {
      myObject['id'] = this.orderId;
      if (this.userData?.userType === 7) {
        myObject['paidAmount'] = formInfo?.paidAmount;
      }
    }

    return myObject;
  }

  private handleCustomerWithOpenOrders(myObject: any): void {
    this.confirmationService.confirm({
      message: this.publicService?.translateTextFromJson('general.hasOpendedOrdersYouSureToContinue'),
      icon: 'pi pi-exclamation-triangle',
      header: this.publicService?.translateTextFromJson('general.warning'),
      accept: () => this.processOrder(myObject),
      reject: () => (this.isSaving = false),
    });
  }

  private handleNoOpenOrders(myObject: any): void {
    this.processOrder(myObject);
  }

  private processOrder(myObject: any): void {
    if (this.isEdit && this.userData?.userType === 7) {
      this.executeDriverArrivedAtStation(myObject);
    } else if (this.isEdit && this.userData?.userType === 8) {
      this.openConfirmCompleteOrderDialog(myObject);
    } else {
      this.addOrUpdateOrder(myObject);
    }
  }

  private executeDriverArrivedAtStation(myObject: any): void {
    this.publicService?.show_loader?.next(true);
    this.orderService
      .addOrUpdateOrderDriverArrivedAtStation(myObject, this.orderId || null)
      .pipe(
        finalize(() => this.publicService?.show_loader?.next(false)),
        catchError((err: any) => {
          this.handleError(err);
          throw err;
        })
      )
      .subscribe((res: any) => this.handleSuccess(res));
  }

  private openConfirmCompleteOrderDialog(myObject: any): void {
    const ref = this.dialogService.open(ConfirmCompleteOrderComponent, {
      header: this.publicService?.translateTextFromJson('general.confirm_order'),
      dismissableMask: false,
      width: '35%',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.confirmed) {
        this.publicService?.show_loader?.next(true);
        this.orderService
          .addOrUpdateOrderComplete(myObject, this.orderId || null)
          .pipe(
            finalize(() => this.publicService?.show_loader?.next(false)),
            catchError((err: any) => {
              this.handleError(err);
              throw err;
            })
          )
          .subscribe((res: any) => this.handleSuccess(res));
      }
    });
  }

  private addOrUpdateOrder(myObject: any): void {
    this.publicService?.show_loader?.next(true);
    this.orderService
      .addOrUpdateOrder(myObject, this.orderId || null)
      .pipe(
        finalize(() => this.publicService?.show_loader?.next(false)),
        catchError((err: any) => {
          this.handleError(err);
          throw err;
        })
      )
      .subscribe((res: any) => this.handleSuccess(res));
  }

  private handleSuccess(res: any): void {
    if (res?.isSuccess && res?.statusCode === 200) {
      applyAddOrRemoveCacheRequest(this.urlsToRemove, 'Remove');
      this.alertWithResponseMessage(res?.message, 'success');
      this.router.navigate(['/dashboard/orders']);
    } else {
      this.alertWithResponseMessage(res?.message, 'info');
    }
    this.isSaving = false;
  }

  private handleError(err: any): void {
    this.alertWithResponseMessage(err?.message, 'error');
    this.isSaving = false;
  }

  private alertWithResponseMessage(message: string | undefined, type: 'success' | 'info' | 'error'): void {
    if (message) {
      this.alertsService?.openSweetAlert(type, message);
    }
  }
  // End Submit Functions


  cancel(): void {
    this.router.navigate(['/dashboard/orders']);
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
