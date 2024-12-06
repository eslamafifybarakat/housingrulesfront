import { TankSize } from './../../../../../enums';
import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TanksService } from './../../../../services/tanks.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { roots } from 'src/app/shared/configs/endPoints';
import { environment } from 'src/environments/environment';
import { setOrRemoveCacheRequestURL } from 'src/app/common/interceptors/caching/caching.utils';
import { EditServiceService } from 'src/app/core/services/lists/edit-service.service';
import { applyAddOrRemoveCacheRequest } from 'src/app/common/storages/session-storage..Enum';

@Component({
  selector: 'app-add-edit-tank',
  templateUrl: './add-edit-tank.component.html',
  styleUrls: ['./add-edit-tank.component.scss']
})
export class AddEditTankComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  isEdit: boolean = false;
  tankId: any;
  isSubcontractorStatus: boolean = false;

  tanksSize: any = [{ value: 1, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size15') },
  { value: 2, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size20') },
  { value: 3, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size32') }];
  isLoadingTanksSize: boolean = false;

  urlsToRemove: string[] = [
    `${environment.apiUrl}/${roots?.dashboard?.tanks?.tanksList}`
  ];

  constructor(
    public checkValidityService: CheckValidityService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private tanksService: TanksService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    public fb: FormBuilder,
    private editService: EditServiceService
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    if (this.modalData?.item?.id) {
      this.tankId = this.modalData?.item?.id;
    }
    this.isEdit = this.modalData?.type == 'edit' ? true : false;
    if (this.isEdit) {
      this.patchValue();
    }
  }

  modalForm = this.fb?.group(
    {
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      tankSize: [null, Validators?.required],
      price: ['', Validators?.required],
      plateNumber: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      active: [false, []],
      isSubcontractor: [false, []],
      cost: [null, { Validators: [], updateOn: "blur" }]
    }
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }

  patchValue(): void {
    this.tanksSize?.forEach((element: any) => {
      if (element?.value == this.modalData?.item?.tankSizeVal) {
        this.modalForm?.patchValue({
          tankSize: element
        })
      }
    });
    let isSubcontractor: any = this.modalData?.item?.isSubcontractor == true ? [true] : [false];
    this.modalForm?.patchValue({
      name: this.modalData?.item?.name,
      price: this.modalData?.item?.price,
      cost: this.modalData?.item?.cost,
      active: this.modalData?.item?.isAvailable,
      plateNumber: this.modalData?.item?.plateNumber,
      isSubcontractor: isSubcontractor,
    });
    this.isSubcontractorChange();
  }

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
    this.modalForm?.patchValue({
      price: price
    });
  }
  onTankClear(): void {
    this.modalForm?.patchValue({
      price: null
    });
  }
  isSubcontractorChange(): void {
    let isSubcontractorStatusVal: any = this.modalForm?.value?.isSubcontractor
    this.isSubcontractorStatus = isSubcontractorStatusVal[0];
    if (isSubcontractorStatusVal) {
      this.publicService?.addValidators(this.modalForm, ['cost']);
    } else {
      this.publicService?.removeValidators(this.modalForm, ['cost']);
    }
  }
  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      myObject['name'] = this.modalForm?.value?.name;
      myObject['isAvailable'] = this.modalForm?.value?.active;
      myObject['tankSize'] = this.modalForm?.value?.tankSize?.['value'];
      myObject['plateNumber'] = this.modalForm?.value?.plateNumber;
      let isSubcontractor: any = this.modalForm?.value?.isSubcontractor;
      myObject['isSubcontractor'] = isSubcontractor[0] == true ? true : false;
      myObject['price'] = this.modalForm?.value?.price;
      if (this.isSubcontractorStatus) {
        myObject['cost'] = this.modalForm?.value?.cost;
      }
      myObject['isWorking'] = false;
      if (this.isEdit) {
        myObject['id'] = this.tankId;
        // myObject['lastModifiedBy'] = 0;
      } else {
        // myObject['createBy'] = 0;
      }
      this.publicService?.show_loader?.next(true);
      this.tanksService?.addOrUpdateTank(myObject, this.tankId ? this.tankId : null)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true && res?.statusCode == 200) {
            applyAddOrRemoveCacheRequest(this.urlsToRemove, 'Remove');
            this.editService.emitRefreshUsers();
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
