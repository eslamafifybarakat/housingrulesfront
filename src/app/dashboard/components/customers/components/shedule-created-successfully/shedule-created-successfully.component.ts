import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderSheduleComponent } from '../order-shedule/order-shedule.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shedule-created-successfully',
  templateUrl: './shedule-created-successfully.component.html',
  styleUrls: ['./shedule-created-successfully.component.scss']
})
export class SheduleCreatedSuccessfullyComponent implements OnInit {
  modalData: any;

  constructor(
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
  }

  browse(): void {
    const ref = this.dialogService?.open(OrderSheduleComponent, {
      dismissableMask: true,
      width: '100%',
      height: '100%',
      styleClass: 'shedule-dialog',
      data: this.modalData
    });
  }
  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
}
