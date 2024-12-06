import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { patterns } from './../../../../../shared/configs/patternValidations';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdersService } from 'src/app/dashboard/services/orders.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { keys } from 'src/app/shared/configs/localstorage-key';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { roots } from 'src/app/shared/configs/endPoints';
import { environment } from 'src/environments/environment';
import { setOrRemoveCacheRequestURL } from 'src/app/common/interceptors/caching/caching.utils';
import { updateItemName } from 'src/app/common/functions/fixNames';
import { applyAddOrRemoveCacheRequest } from 'src/app/common/storages/session-storage..Enum';

@Component({
  selector: 'app-add-edit-supervisor',
  templateUrl: './add-edit-supervisor.component.html',
  styleUrls: ['./add-edit-supervisor.component.scss']
})
export class AddEditSupervisorComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  isEdit: boolean = false;
  supervisorId: any;

  districtsList: any = [];
  isLoadingDistricts: boolean = false;
  currLang: any = '';

  isLoadingSupervisors: boolean = false;

  urlsToRemove: string[] = [
    `${environment.apiUrl}/${roots.dashboard.supervisors.supervisorsList}`,
    `${environment?.apiUrl}/${roots?.dashboard?.districtsList}`
   ];

  constructor(
    public checkValidityService: CheckValidityService,
    private supervisorsService: SupervisorsService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private orderService: OrdersService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.currLang = window.localStorage.getItem(keys?.language);
    this.modalData = this.config?.data;
    if (this.modalData?.item?.id) {
      this.supervisorId = this.modalData?.item?.id;
    }
    this.isEdit = this.modalData?.type == 'edit' ? true : false;
    if (this.isEdit) {
      this.patchValue();
    } else {
      this.getAllDistricts();
    }
  }

  modalForm = this.fb?.group(
    {
      district: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      // username: ['', {
      //   validators: [
      //     Validators.required,
      //     Validators?.pattern(patterns?.userName),
      //     Validators?.minLength(3)], updateOn: "blur"
      // }],
      arName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3), Validators.pattern(patterns?.arName)],
        updateOn: "blur"
      }],
      enName: ['', {
        validators: [
          Validators?.minLength(3), Validators.pattern(patterns?.enName)],
        updateOn: "blur"
      }],
      phone: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.phone)], updateOn: "blur"
      }],
      isWorking: [false, []]
    },
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }

  getAllDistricts(): any {
    this.isLoadingDistricts = true;
    this.orderService?.getDistrictsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.districtsList = res?.data;
          this.districtsList.forEach((item: any) => {
            updateItemName(item, item.arName, item.enName); 
          });
          if (this.isEdit) {
            let ids: any = [];
            this.modalData?.item?.districtsVal?.forEach((element: any) => {
              this.districtsList?.forEach((item: any) => {
                if (element == item?.id) {
                  ids?.push(item);
                }
              });
            });
            this.isLoadingDistricts = false;
            this.modalForm?.patchValue({
              district: ids
            });
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
  patchValue(): void {
    let districtsArr: any = [];
    this.modalForm?.patchValue({
      arName: this.modalData?.item?.arName,
      enName: this.modalData?.item?.enName,
      district: districtsArr,
      phone: this.modalData?.item?.mobileNumber,
      isWorking: this.modalData?.item?.isWorkingVal
    });
    this.getAllDistricts();
  }

  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      let disticts: any = [];
      let formData: any = this.modalForm?.value;
      formData?.district?.forEach((element: any) => {
        disticts?.push(element?.id);
      });
      myObject['arName'] = this.modalForm?.value?.arName;
      myObject['enName'] = this.modalForm?.value?.enName;
      myObject['isWorking'] = this.modalForm?.value?.isWorking;
      myObject['mobileNumber'] = this.modalForm?.value?.phone;
      myObject['districtIds'] = disticts;
      // myObject['userId'] = '0';
      if (this.isEdit) {
        myObject['id'] = this.supervisorId;
        // myObject['lastModifiedBy'] = 0;
      } else {
        // myObject['createBy'] = 0;
      }
      this.publicService?.show_loader?.next(true);
      this.supervisorsService?.addOrUpdateSupervisor(myObject, this.supervisorId ? this.supervisorId : null)?.subscribe(
        (res: any) => {
          if (res?.statusCode == 200 && res?.isSuccess == true) {
            applyAddOrRemoveCacheRequest(this.urlsToRemove, 'Remove');
            this.ref.close({ listChanged: true });
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
