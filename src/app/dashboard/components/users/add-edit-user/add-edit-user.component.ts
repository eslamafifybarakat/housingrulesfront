import { CheckValidityService } from './../../../../shared/services/check-validity/check-validity.service';
import { ConfirmPasswordValidator } from './../../../../shared/configs/confirm-password-validator';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { AlertsService } from './../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../shared/services/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { patterns } from './../../../../shared/configs/patternValidations';
import { DriversService } from 'src/app/dashboard/services/drivers.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsersService } from './../../../services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  checked: boolean = false;
  modalData: any;
  isEdit: boolean = false;
  userId: any;
  userData: any;

  userTypesList: any = [];
  isLoadingUserTypes: boolean = false;

  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  driversList: any = [];
  isLoadingDrivers: boolean = false;

  constructor(
    public checkValidityService: CheckValidityService,
    private supervisorsService: SupervisorsService,
    private driversService: DriversService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    if (this.modalData?.item?.id) {
      this.userId = this.modalData?.item?.id;
    }
    this.isEdit = this.modalData?.type == 'edit' ? true : false;
    if (this.isEdit) {
      // this.patchValue();
    } else {
      this.getUserTypes();
    }
  }

  userForm = this.fb?.group(
    {
      // name: ['', {
      //   validators: [
      //     Validators.required,
      //     Validators?.minLength(3)], updateOn: "blur"
      // }],
      username: ['', {
        validators: [
          Validators.required,
          Validators?.pattern(patterns?.userName),
          Validators?.minLength(3)], updateOn: "blur"
      }],
      // email: ['', {
      //   validators: [
      //     Validators.required,
      //     Validators.pattern(patterns?.email),], updateOn: "blur"
      // }],
      userType: [null, {
        validators: [Validators.required]
      }],
      // mobilePhone: ['', {
      //   validators: [
      //     Validators.required, Validators.pattern(patterns?.phone)], updateOn: "blur"
      // }],
      password: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(8),
          Validators?.maxLength(20),
        ], updateOn: "blur"
      }],
      confirmPassword: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(8),
          Validators?.maxLength(20),
        ], updateOn: "blur"
      }],
      supervisor: [null, {
        validators: []
      }],
      driver: [null, {
        validators: []
      }],
    },
    {
      validator: ConfirmPasswordValidator.MatchPassword
    }
  );
  get formControls(): any {
    return this.userForm?.controls;
  }

  getUserTypes(): void {
    this.userTypesList = this.publicService?.getUserTypes();
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
          if (this.isEdit) {
            this.supervisorsList?.forEach((supervisor: any) => {
              if (supervisor?.id == this.userData?.supervisorId) {
                this.userForm?.patchValue({
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
    if (this.isEdit) {
      this.supervisorsList?.forEach((supervisor: any) => {
        if (supervisor?.id == this.userData?.supervisorId) {
          this.userForm?.patchValue({
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
              if (driver?.id == this.userData?.driverId) {
                this.userForm?.patchValue({
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
        if (driver?.id == this.userData?.driverId) {
          this.userForm?.patchValue({
            driver: driver
          })
        }
      });
    }
  }

  changeUserType(item: any): void {
    console.log(item);
    if (item?.value == 2 || item?.value == 4) {
      this.publicService?.addValidators(this.userForm, ['supervisor']);
      this.getAllSupervisors();
    } else {
      this.publicService?.removeValidators(this.userForm, ['supervisor']);
    }
    if (item?.value == 5) {
      this.publicService?.addValidators(this.userForm, ['driver']);
      this.getAllDrivers();
    } else {
      this.publicService?.removeValidators(this.userForm, ['driver']);
    }
  }
  // patchValue(): void {
  //   this.userForm?.patchValue({
  //     email: 'Ahmed44@gmail.com',
  //     newpassword: '67gg88',
  //     confirmpassword: '67gg88',
  //     active: true
  //   })
  // }

  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.userForm?.valid) {
      this.publicService?.show_loader?.next(true);
      // myObject['name'] = this.userForm?.value?.name;
      myObject['username'] = this.userForm?.value?.username;
      myObject['userType'] = this.userForm?.value?.userType?.id;
      // myObject['email'] = this.userForm?.value?.email;
      // myObject['mobilePhone'] = this.userForm?.value?.mobilePhone;
      myObject['password'] = this.userForm?.value?.password;
      // myObject['confirmPassword'] = this.userForm?.value?.confirmPassword;

      if (this.userForm?.value?.userType?.value == 2 || this.userForm?.value?.userType?.value == 4) {
        myObject['entityId'] = this.userForm?.value?.supervisor?.id;
      }
      if (this.userForm?.value?.userType?.value == 5) {
        myObject['entityId'] = this.userForm?.value?.driver?.id;
      }
      myObject['isSuspended'] = true;
      myObject['allowTerminal'] = true;
      if (this.isEdit) {
        myObject['id'] = this.userId;
        myObject['lastModifiedBy'] = 0;
      } else {
        myObject['createBy'] = 0;
      }
      this.publicService?.show_loader?.next(true);
      this.usersService?.addOrUpdateUser(myObject, this.userId ? this.userId : null)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true) {
            this.ref?.close({ listChanged: true });
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
      this.publicService?.show_loader?.next(false);
      this.checkValidityService?.validateAllFormFields(this.userForm);
    }
    this.cdr?.detectChanges();
  }
  cancel(): void {
    this.ref?.close({});
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
