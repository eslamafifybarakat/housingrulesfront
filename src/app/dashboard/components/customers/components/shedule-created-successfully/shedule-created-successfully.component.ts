import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnInit } from '@angular/core';
import { OrderSheduleComponent } from '../order-shedule/order-shedule.component';

@Component({
  selector: 'app-shedule-created-successfully',
  templateUrl: './shedule-created-successfully.component.html',
  styleUrls: ['./shedule-created-successfully.component.scss']
})
export class SheduleCreatedSuccessfullyComponent implements OnInit {

  constructor(
    private dialogService: DialogService,
    private ref: DynamicDialogRef,
  ) { }

  ngOnInit(): void {
  }

  browse(): void {
    const ref = this.dialogService?.open(OrderSheduleComponent, {
      dismissableMask: true,
      width: '100%',
      height: '100%',
      styleClass: 'shedule-dialog'
    });
  }
  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
}
