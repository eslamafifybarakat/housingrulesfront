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
          Validators?.minLength(3)], updateOn: "blur"
      }],
      active: [false, []]
    },
  );

  get formControls(): any {
    return this.modalForm?.controls;
  }
  patchValue(): void {
    this.modalForm?.patchValue({
      name: this.modalData?.item?.name,
      active: this.modalData?.item?.is_active
    })
  }

  submit(): void {
    const myObject: { [key: string]: any } = {};

    if (this.modalForm?.valid) {
      myObject['name'] = this.modalForm?.value?.name;
      myObject['is_active'] = this.modalForm?.value?.active;
      this.publicService?.show_loader?.next(true);
      this.tanksService?.addOrUpdateTank(myObject, this.tankId ? this.tankId : null)?.subscribe(
        (res: any) => {
          if (res?.code == 200) {
            this.ref.close({ listChanged: true });
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
