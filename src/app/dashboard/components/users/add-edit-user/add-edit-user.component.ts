import { CheckValidityService } from './../../../../shared/services/check-validity/check-validity.service';
import { ConfirmPasswordValidator } from './../../../../shared/configs/confirm-password-validator';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { AlertsService } from './../../../../core/services/alerts/alerts.service';
import { ServiceAgentService } from './../../../services/service-agent.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PublicService } from './../../../../shared/services/public.service';
import { DriversService } from 'src/app/dashboard/services/drivers.service';
import { patterns } from './../../../../shared/configs/patternValidations';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsersService } from './../../../services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { keys } from 'src/app/shared/configs/localstorage-key';
import { setOrRemoveCacheRequestURL } from 'src/app/common/interceptors/caching/caching.utils';
import { roots } from 'src/app/shared/configs/endPoints';
import { environment } from 'src/environments/environment';
import { EditServiceService } from 'src/app/core/services/lists/edit-service.service';

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

  userTypesList: any = [];
  isLoadingUserTypes: boolean = false;

  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  serviceAgentsList: any = [];
  isLoadingServiceAgents: boolean = false;

  driversList: any = [];
  isLoadingDrivers: boolean = false;

  constructor(
    public checkValidityService: CheckValidityService,
    private serviceAgentService: ServiceAgentService,
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
    private editService :EditServiceService
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    if (this.modalData?.item?.id) {
      this.userId = this.modalData?.item?.id;
      this.publicService?.removeValidators(this.userForm, ['password']);
      this.publicService?.removeValidators(this.userForm, ['confirmPassword']);
    }
    this.isEdit = this.modalData?.type == 'edit' ? true : false;
    if (this.isEdit) {
      this.patchValue();
    }
    this.getUserTypes();
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
      userNameStr: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
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
      serviceAgent: [null, {
        validators: []
      }],
      active: [false, []],
      allowTerminal: [false, []],
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
    if (this.isEdit) {
      this.userTypesList?.forEach((element: any) => {
        if (element?.value == this.modalData?.item?.userTypeId) {
          this.userForm.patchValue({
            userType: element
          });
        }
        this.changeUserType({ value: this.modalData?.item?.userTypeId });
      });
    }
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
              if (supervisor?.id == this.modalData?.item?.entityId) {
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
              if (driver?.id == this.modalData?.item?.entityId) {
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
  }
  getAllServiceAgents(): any {
    this.isLoadingServiceAgents = true;
    this.serviceAgentService?.getServiceAgentsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          let arr: any = [];
          res?.data ? res?.data?.forEach((serviceAgent: any) => {
            arr?.push({
              name: serviceAgent?.arName,
              id: serviceAgent?.id
            });
          }) : '';
          this.serviceAgentsList = arr;
          if (this.isEdit) {
            this.serviceAgentsList?.forEach((serviceAgent: any) => {
              if (serviceAgent?.id == this.modalData?.item?.entityId) {
                this.userForm?.patchValue({
                  serviceAgent: serviceAgent
                })
              }
            });
          }
          this.isLoadingServiceAgents = false;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoadingServiceAgents = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoadingServiceAgents = false;
      });
    this.cdr?.detectChanges();
  }

  changeUserType(item: any): void {
    if (item?.value == 3 || item?.value == 4) {
      this.publicService?.addValidators(this.userForm, ['serviceAgent']);
      this.getAllServiceAgents();
    } else {
      this.publicService?.removeValidators(this.userForm, ['supervisor']);
      this.publicService?.removeValidators(this.userForm, ['driver']);
    }
    if (item?.value == 5) {
      this.publicService?.addValidators(this.userForm, ['supervisor']);
      this.getAllSupervisors();
    } else {
      this.publicService?.removeValidators(this.userForm, ['driver']);
      this.publicService?.removeValidators(this.userForm, ['serviceAgent']);

    }
    if (item?.value == 6) {
      this.publicService?.addValidators(this.userForm, ['driver']);
      this.getAllDrivers();
    } else {
      this.publicService?.removeValidators(this.userForm, ['supervisor']);
      this.publicService?.removeValidators(this.userForm, ['serviceAgent']);
    }
  }
  patchValue(): void {
    this.userForm?.patchValue({
      active: this.modalData?.item?.isSuspended == true ? false : true,
      allowTerminal: this.modalData?.item?.allowTerminal == false ? [false] : [true],
      username: this.modalData?.item?.username ? this.modalData?.item?.username : '',
      userNameStr: this.modalData?.item?.userNameStr ? this.modalData?.item?.userNameStr : '',
    })
  }

  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.userForm?.valid) {
      // myObject['name'] = this.userForm?.value?.name;
      myObject['username'] = this.userForm?.value?.username;
      myObject['userType'] = this.userForm?.value?.userType?.id;
      // myObject['email'] = this.userForm?.value?.email;
      myObject['userNameStr'] = this.userForm?.value?.userNameStr;
      myObject['isSuspended'] = !this.userForm?.value?.active;
      myObject['allowTerminal'] = this.userForm?.value?.allowTerminal[0] == true ? true : false;

      if (this.userForm?.value?.userType?.value == 3 || this.userForm?.value?.userType?.value == 4) {
        myObject['entityId'] = this.userForm?.value?.serviceAgent?.id;
      }
      if (this.userForm?.value?.userType?.value == 5) {
        myObject['entityId'] = this.userForm?.value?.supervisor?.id;
      }
      if (this.userForm?.value?.userType?.value == 6) {
        myObject['entityId'] = this.userForm?.value?.driver?.id;
      }
      if (this.isEdit) {
        myObject['id'] = this.userId;
      } else {
        myObject['password'] = this.userForm?.value?.password;

        let tenantidKey = window.localStorage.getItem(keys.tenantid);
      //s myObject['tenantId'] = tenantidKey ? tenantidKey : 0;
      }

      this.publicService?.show_loader?.next(true);
      this.usersService?.addOrUpdateUser(myObject, this.userId ? this.userId : null)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true) {
            setOrRemoveCacheRequestURL(
              `${environment.apiUrl}/${roots.dashboard.users.usersList}`,
              'Remove'
            );
            this.ref?.close({ listChanged: true });
            this.publicService?.show_loader?.next(false);
            res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
          } else {
            setOrRemoveCacheRequestURL(
              `${environment.apiUrl}/${roots.dashboard.users.usersList}`,
              'Remove'
            );
            this.editService.emitRefreshUsers();
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
