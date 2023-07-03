import { CheckValidityService } from 'src/app/shared/services/check-validity/check-validity.service';
import { ServiceAgentService } from './../../../../services/service-agent.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { patterns } from './../../../../../shared/configs/patternValidations';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertsService } from 'src/app/core/services/alerts/alerts.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-service-agent',
  templateUrl: './add-edit-service-agent.component.html',
  styleUrls: ['./add-edit-service-agent.component.scss']
})
export class AddEditServiceAgentComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  isEdit: boolean = false;
  serviceAgentId: any;

  constructor(
    public checkValidityService: CheckValidityService,
    private serviceAgentService: ServiceAgentService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    if (this.modalData?.item?.id) {
      this.serviceAgentId = this.modalData?.item?.id;
    }
    this.isEdit = this.modalData?.type == 'edit' ? true : false;
    if (this.isEdit) {
      this.patchValue();
    }
  }

  modalForm = this.fb?.group(
    {
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
  patchValue(): void {
    this.modalForm?.patchValue({
      arName: this.modalData?.item?.arName,
      enName: this.modalData?.item?.enName,
      phone: this.modalData?.item?.mobileNumber,
      isWorking: this.modalData?.item?.isWorking
    })
  }

  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      myObject['arName'] = this.modalForm?.value?.arName;
      myObject['enName'] = this.modalForm?.value?.enName;
      myObject['isWorking'] = this.modalForm?.value?.isWorking;
      myObject['mobileNumber'] = this.modalForm?.value?.phone;
      if (this.isEdit) {
        myObject['id'] = this.serviceAgentId;
      } else {
        myObject['createBy'] = 0;
      }
      this.publicService?.show_loader?.next(true);
      this.serviceAgentService?.addOrUpdateServiceAgent(myObject, this.serviceAgentId ? this.serviceAgentId : null)?.subscribe(
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
