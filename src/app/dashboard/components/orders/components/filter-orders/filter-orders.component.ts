import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DriversService } from './../../../../services/drivers.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-orders',
  templateUrl: './filter-orders.component.html',
  styleUrls: ['./filter-orders.component.scss']
})
export class FilterOrdersComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  driversList: any = [];
  isLoadingDrivers: boolean = false;

  orderStatusList: any = [];
  isLoadingDriverStatus: boolean = false;

  minEndDate: any;
  isSelectStartDate: boolean = false;

  modalData: any = this.config?.data;

  constructor(
    public checkValidityService: CheckValidityService,
    private supervisorsService: SupervisorsService,
    private driversService: DriversService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getAllSupervisors();
    this.getAllDrivers();
    this.orderStatusList = this.publicService?.getOrderStatus();
    let orderStatus: any = null;
    this.orderStatusList?.forEach((item: any) => {
      if (item?.value == this.modalData?.orderStatus) {
        orderStatus = item;
      }
    });
    this.modalForm?.patchValue({
      orderStatus: orderStatus
    })
    this.modalForm?.patchValue({
      startDate: this.modalData?.startTime,
      endDate: this.modalData?.endTime,
    })
  }

  modalForm = this.fb?.group(
    {
      startDate: [null, []],
      endDate: [null, []],
      supervisor: ['', []],
      driver: ['', []],
      orderStatus: ['', []],
    },
  );

  get formControls(): any {
    return this.modalForm?.controls;
  }

  selectStartDate(event: any): void {
    if (event) {
      this.minEndDate = event;
      this.isSelectStartDate = true;
    }
    this.modalForm?.get('endDate')?.reset();
  }
  clearStartDate(): void {
    this.isSelectStartDate = false;
    this.publicService?.removeValidators(this.modalForm, ['endDate']);
    this.modalForm?.get('endDate')?.reset();
  }
  getAllSupervisors(): any {
    this.isLoadingSupervisors = true;
    this.supervisorsService?.getSupervisorsList()?.subscribe(
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
          this.isLoadingSupervisors = false;
          let supervisor: any = null;
          this.supervisorsList?.forEach((item: any) => {
            if (item?.id == this.modalData?.supervisorId) {
              supervisor = item;
            }
          });
          this.modalForm?.patchValue({
            supervisor: supervisor
          })
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
  }
  getAllDrivers(): any {
    this.isLoadingDrivers = true;
    this.driversService?.getDriversList()?.subscribe(
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
          this.isLoadingDrivers = false;
          let driver: any = null;
          this.driversList?.forEach((item: any) => {
            if (item?.id == this.modalData?.driverId) {
              driver = item;
            }
          });
          this.modalForm?.patchValue({
            driver: driver
          })
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
  }
  onChangeStatus(event: any): void {
    console.log(this.modalForm?.value);
  }
  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      let formInfo: any = this.modalForm?.value;
      myObject['startDate'] = formInfo?.startDate;
      myObject['endDate'] = formInfo?.endDate;
      myObject['supervisorId'] = formInfo?.supervisor?.id;
      myObject['driverId'] = formInfo?.driver?.id;
      myObject['orderStatus'] = formInfo?.orderStatus?.id;
      this.ref?.close(myObject)
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

