import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { patterns } from './../../../../../shared/configs/patternValidations';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DriversService } from './../../../../services/drivers.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TanksService } from './../../../../services/tanks.service';
import { Validators, FormBuilder } from '@angular/forms';
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
    this.orderStatusList = this.publicService?.getOrderStatus();
  }

  modalForm = this.fb?.group(
    {
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],

      supervisor: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      driver: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      driverStatus: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      phone: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],

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
        if (res?.code == 200) {
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

    this.supervisorsList = [
      { id: 1, name: "ali ahmed" },
      { id: 1, name: "ali ahmed" },
      { id: 33, name: "ali ahmed" },
      { id: 1, name: "ali ahmed" },
      { id: 1, name: "ali ahmed" },
      { id: 1, name: "ali ahmed" },
    ]
  }
  getAllDrivers(): any {
    this.isLoadingDrivers = true;
    this.driversService?.getDriversList()?.subscribe(
      (res: any) => {
        if (res?.code == 200) {
          res?.data ? res?.data?.forEach((item: any) => {
            this.driversList?.push({
              name: item?.name,
              id: item?.id
            });
          }) : '';
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
      { id: 31, name: 'tank1' },
    ]
  }

  submit(): void {
    const myObject: { [key: string]: any } = {};

    if (this.modalForm?.valid) {
      // myObject['name'] = this.modalForm?.value?.name;
      // myObject['username'] = this.modalForm?.value?.username;
      // myObject['supervisor'] = this.modalForm?.value?.supervisor?.id;
      // myObject['tank'] = this.modalForm?.value?.tank?.id;
      // myObject['driver_status'] = this.modalForm?.value?.driverStatus?.value;
      myObject['mobile_phone'] = this.modalForm?.value?.phone;

      this.publicService?.show_loader?.next(true);
      this.driversService?.addOrUpdateDriver(myObject)?.subscribe(
        (res: any) => {
          if (res?.code == 200) {
            this.ref?.close({ listChanged: true });
            this.publicService?.show_loader?.next(false);
          } else {
            res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
            this.publicService?.show_loader?.next(false);
          }
        },
        (err: any) => {
          err?.message ? this.alertsService?.openSnackBar(err?.message) : '';
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

