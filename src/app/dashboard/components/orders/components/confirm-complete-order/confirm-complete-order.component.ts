import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { OrdersService } from './../../../../services/orders.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-complete-order',
  templateUrl: './confirm-complete-order.component.html',
  styleUrls: ['./confirm-complete-order.component.scss']
})
export class ConfirmCompleteOrderComponent implements OnInit {
  modalData: any;
  orderId: any;

  constructor(
    private publicService: PublicService,
    private alertsService: AlertsService,
    private orderService: OrdersService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.orderId = this.modalData?.id;
  }
  confirm(): void {
    this.ref?.close({ confirmed: true });
  }

  cancel(): void {
    this.ref?.close({ confirmed: false });
  }
}
