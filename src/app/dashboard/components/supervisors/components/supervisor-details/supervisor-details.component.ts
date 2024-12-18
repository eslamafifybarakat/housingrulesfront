import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AddEditSupervisorComponent } from '../add-edit-supervisor/add-edit-supervisor.component';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PublicService } from './../../../../../shared/services/public.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditServiceService } from 'src/app/core/services/lists/edit-service.service';

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
    private editS:EditServiceService
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
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe(() => {
      // Emit an event to refresh the supervisors list
      this.editS.emitRefreshSupervisors();
    });
    
  }

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
