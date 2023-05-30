import { OrdersService } from './../../../../services/orders.service';
import { AlertsService } from 'src/app/core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { CheckValidityService } from '../../../../../shared/services/check-validity/check-validity.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss']
})
export class CancelOrderComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  modalData: any;
  cancellationCauses: any = [];
  isLoadingCancellationCauses: boolean = false;

  constructor(
    private checkValidityService: CheckValidityService,
    private alertsService: AlertsService,
    private config: DynamicDialogConfig,
    public publicService: PublicService,
    private orderService: OrdersService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.cancellationCauses = this.publicService?.getOrdersCancellationReasons();
  }
  modalForm = this.fb?.group(
    {
      cancellationCauses: [null, [Validators.required]],
      cancellationDesc: ['', {
        validators: [Validators?.minLength(3)],
        updateOn: "blur"
      }],
    },
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }
  onChangeCancellationCause(event: any): void {
    if (event?.value?.value == 100) {
      this.publicService?.addValidators(this.modalForm, ['cancellationDesc']);
    } else {
      this.publicService?.removeValidators(this.modalForm, ['cancellationDesc']);
    }
  }
  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      let formInfo: any = this.modalForm?.value;
      myObject['orderId'] = this.modalData?.id;
      myObject['cancellatinCauses'] = formInfo?.cancellationCauses?.value;
      if (formInfo?.cancellationCauses?.value == 100) {
        myObject['cancellationDesc'] = formInfo?.cancellationDesc;
      }

      this.publicService?.show_loader?.next(true);
      this.orderService?.cancelOrder(myObject)?.subscribe(
        (res: any) => {
          if (res?.statusCode == 200 && res?.isSuccess == true) {
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
      this.ref?.close({ myObject })
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
