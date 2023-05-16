import { keys } from './../../../../../shared/configs/localstorage-key';
import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { Subscription } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdersService } from './../../../../services/orders.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  modalData: any;

  paymentMethodsList: any = [
    { id: 1, value: 1, name: "Cash" },
    { id: 2, value: 2, name: "Mada" },
    { id: 3, value: 3, name: "Transfer" },
    { id: 4, value: 4, name: "Credit" }
  ]
  isLoadingPaymentMethods: boolean = false;

  constructor(
    public checkValidityService: CheckValidityService,
    public publicService: PublicService,
    private alertsService: AlertsService,
    private orderService: OrdersService,
    public config: DynamicDialogConfig,
    public cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    console.log(this.modalData);
  }

  confirmOrderForm = this.fb?.group(
    {
      paidAmount: ['', {
        validators: [Validators.required], updateOn: "blur"
      }],
      paymentMethod: ['', {
        validators: [Validators.required], updateOn: "blur"
      }],
    }
  );
  get formControls(): any {
    return this.confirmOrderForm?.controls;
  }


  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.confirmOrderForm?.valid) {
      this.publicService?.show_loader?.next(true);
      let userLoginData: any = JSON.parse(window.localStorage.getItem(keys?.userLoginData) || '{}');

      myObject['amount'] = this.confirmOrderForm?.value?.paidAmount;
      myObject['paymentMethod'] = this.confirmOrderForm?.value?.paymentMethod;
      myObject['orderId'] = this.modalData?.item?.id;
      myObject['recivedBy'] = userLoginData?.id;
      this.orderService?.confirmSettlementeOrder(myObject)?.subscribe(
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
      this.checkValidityService?.validateAllFormFields(this.confirmOrderForm);
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
