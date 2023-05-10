import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AddEditSupervisorComponent } from '../add-edit-supervisor/add-edit-supervisor.component';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PublicService } from './../../../../../shared/services/public.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-supervisor-details',
  templateUrl: './supervisor-details.component.html',
  styleUrls: ['./supervisor-details.component.scss']
})
export class SupervisorDetailsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  supervisorsId: any;

  constructor(
    public checkValidityService: CheckValidityService,
    private dialogService: DialogService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    protected router: Router,
  ) { }


  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.supervisorsId = this.modalData?.id;
  }

  edit(): void {
    this.ref?.close();
    const ref = this.dialogService?.open(AddEditSupervisorComponent, {
      data: {
        item: this.modalData,
        type: 'edit'
      },
      header: this.publicService?.translateTextFromJson('dashboard.supervisors.editSupervisor'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom_modal'
    });
  }

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
