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

  tanksSize: any = [{ value: 0, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size13') },
  { value: 1, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size20') },
  { value: 2, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size32') }];
  isLoadingTanksSize: boolean = false;

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
          Validators?.minLength(3)]
      }],
      tankSize: [null, Validators?.required],
      price: ['', Validators?.required],
      plateNumber: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)]
      }],
      active: [false, []]
    },{ updateOn: "blur" }
  );

  get formControls(): any {
    return this.modalForm?.controls;
  }
  patchValue(): void {
    console.log(this.modalData);
    this.tanksSize?.forEach((element: any) => {
      if (element?.value == this.modalData?.item?.tankSizeVal) {
        this.modalForm?.patchValue({
          tankSize: element
        })
      }
    });
    this.modalForm?.patchValue({
      name: this.modalData?.item?.name,
      price: this.modalData?.item?.price,
      active: this.modalData?.item?.isAvailable,
      plateNumber: this.modalData?.item?.plateNumber
    })
  }

  submit(): void {
    console.log(this.modalForm);

    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      myObject['name'] = this.modalForm?.value?.name;
      myObject['isAvailable'] = this.modalForm?.value?.active;
      myObject['tankSize'] = this.modalForm?.value?.tankSize?.['value'];
      myObject['plateNumber'] = this.modalForm?.value?.plateNumber;
      myObject['price'] = this.modalForm?.value?.price;
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
