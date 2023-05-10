import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { ConfirmPasswordValidator } from 'src/app/shared/configs/confirm-password-validator';
import { SupervisorsService } from './../../../../services/supervisors.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { patterns } from './../../../../../shared/configs/patternValidations';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DriversService } from './../../../../services/drivers.service';
import { TanksService } from './../../../../services/tanks.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-driver',
  templateUrl: './add-edit-driver.component.html',
  styleUrls: ['./add-edit-driver.component.scss']
})
export class AddEditDriverComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  tanksList: any = [];
  isLoadingTanks: boolean = false;

  driverStatusList: any = [];
  isLoadingDriverStatus: boolean = false;

  driverData: any;
  isFullLoading: boolean = false;

  modalData: any;
  isEdit: boolean = false;
  driverId: any;

  constructor(
    public checkValidityService: CheckValidityService,
    private supervisorsService: SupervisorsService,
    private driversService: DriversService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private tanksService: TanksService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    if (this.modalData?.item?.id) {
      this.driverId = this.modalData?.item?.id;
    }
    this.isEdit = this.modalData?.type == 'edit' ? true : false;
    if (this.isEdit) {
      this.getDriverData(this.driverId);
      this.publicService?.removeValidators(this.modalForm, ['password']);
      this.publicService?.removeValidators(this.modalForm, ['confirmPassword']);
    } else {
      this.getAllTanks();
      this.getAllSupervisors();
      this.getDriverStatus();
    }
  }

  modalForm = this.fb?.group(
    {
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      username: ['', {
        validators: [
          Validators.required,
          Validators?.pattern(patterns?.userName),
          Validators?.minLength(3)], updateOn: "blur"
      }],
      supervisor: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      tank: ['', {
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
      password: ['', {
        validators: [
          Validators.required,
          Validators.pattern(patterns?.password)
        ], updateOn: "blur"
      }],
      confirmPassword: ['', {
        validators: [
          Validators.required,
          Validators.pattern(patterns?.password)
        ], updateOn: "blur"
      }]
    },
    {
      validator: ConfirmPasswordValidator?.MatchPassword
    }
  );

  get formControls(): any {
    return this.modalForm?.controls;
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
          if (this.isEdit) {
            this.supervisorsList?.forEach((supervisor: any) => {
              if (supervisor?.id == this.driverData?.supervisorId) {
                this.modalForm?.patchValue({
                  supervisor: supervisor
                })
              }
            });
          }
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
    if (this.isEdit) {
      this.supervisorsList?.forEach((supervisor: any) => {
        if (supervisor?.id == this.driverData?.supervisorId) {
          this.modalForm?.patchValue({
            supervisor: supervisor
          })
        }
      });
    }
  }
  getAllTanks(): any {
    this.isLoadingTanks = true;
    this.tanksService?.getTanksList()?.subscribe(
      (res: any) => {
        if (res?.code == 200) {
          res?.data ? res?.data?.forEach((tank: any) => {
            this.tanksList?.push({
              name: tank?.name,
              id: tank?.id
            });
          }) : '';
          if (this.isEdit) {
            this.tanksList?.forEach((tank: any) => {
              if (tank?.id == this.driverData?.tankId) {
                this.modalForm?.patchValue({
                  tank: tank
                })
              }
            });
          }
          this.isLoadingTanks = false;
        } else {
          res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
          this.isLoadingTanks = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSnackBar(err?.message) : '';
        this.isLoadingTanks = false;
      });
    this.cdr?.detectChanges();

    this.tanksList = [
      { id: 1, name: 'tank1' },
      { id: 2, name: 'tank1' },
      { id: 21, name: 'tank1' },
      { id: 31, name: 'tank1' },
    ]
    if (this.isEdit) {
      this.tanksList?.forEach((tank: any) => {
        if (tank?.id == this.driverData?.tankId) {
          this.modalForm?.patchValue({
            tank: tank
          })
        }
      });
    }
  }
  getDriverStatus(): void {
    this.driverStatusList = [
      { id: 1, value: 'available', name: this.publicService?.translateTextFromJson('general.available') },
      { id: 2, value: 'busy', name: this.publicService?.translateTextFromJson('general.busy') },
      { id: 3, value: 'far', name: this.publicService?.translateTextFromJson('general.far') },
    ]
    if (this.isEdit) {
      this.driverStatusList?.forEach((status: any) => {
        if (status?.value == this.driverData?.driver_status) {
          this.modalForm?.patchValue({
            driverStatus: status
          })
        }
      });
    }
  }
  patchValue(): void {
    this.modalForm?.patchValue({
      name: this.driverData?.name,
      username: this.driverData?.username,
      phone: this.driverData?.mobile_phone,
    })
  }
  getDriverData(id: number): void {
    this.isFullLoading = true;
    this.driversService?.getDriverById(id)?.subscribe(
      (res: any) => {
        if (res?.code == 200) {
          this.driverData = res?.data ? res?.data : null;
          this.getAllTanks();
          this.getAllSupervisors();
          this.getDriverStatus();
          this.patchValue();
          this.isFullLoading = false;
        } else {
          res?.message ? this.alertsService.openSnackBar(res?.message) : '';
          this.isFullLoading = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService.openSnackBar(err?.message) : '';
        this.isFullLoading = false;
      });
    this.cdr.detectChanges();

    this.driverData = {
      id: 17, name: 'marwan ali', username: 'marwan12', supervisorId: 33, tankId: 21, driver_status: 'far', mobile_phone: '0289783938'
    }
    this.getAllTanks();
    this.getAllSupervisors();
    this.getDriverStatus();
    this.patchValue();
  }

  submit(): void {
    const myObject: { [key: string]: any } = {};

    if (this.modalForm?.valid) {
      myObject['name'] = this.modalForm?.value?.name;
      myObject['username'] = this.modalForm?.value?.username;
      myObject['supervisor'] = this.modalForm?.value?.supervisor?.id;
      myObject['tank'] = this.modalForm?.value?.tank?.id;
      myObject['driver_status'] = this.modalForm?.value?.driverStatus?.value;
      myObject['mobile_phone'] = this.modalForm?.value?.phone;
      if (!this.isEdit) {
        myObject['password'] = this.modalForm?.value?.password;
        myObject['confirmPassword'] = this.modalForm?.value?.confirmPassword;
      }

      this.driversService?.addOrUpdateDriver(myObject, this.driverId ? this.driverId : null)?.subscribe(
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
