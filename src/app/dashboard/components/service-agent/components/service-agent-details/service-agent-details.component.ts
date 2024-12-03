import { AddEditServiceAgentComponent } from '../add-edit-service-agent/add-edit-service-agent.component';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PublicService } from 'src/app/shared/services/public.service';
import { Component, OnInit } from '@angular/core';
import { EditServiceService } from 'src/app/core/services/lists/edit-service.service';

@Component({
  selector: 'app-service-agent-details',
  templateUrl: './service-agent-details.component.html',
  styleUrls: ['./service-agent-details.component.scss']
})
export class ServiceAgentDetailsComponent implements OnInit {

  modalData: any;
  tankId: any;

  constructor(
    private dialogService: DialogService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private editService:EditServiceService
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.tankId = this.modalData?.id;
  }

  edit(): void {
    this.ref?.close();
    const ref = this.dialogService?.open(AddEditServiceAgentComponent, {
      data: {
        item: this.modalData,
        type: 'edit'
      },
      header: this.publicService?.translateTextFromJson('dashboard.serviceAgent.editServiceAgent'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe(() => {
      // Emit an event to refresh the drivers list
      this.editService.emitRefreshServiceAgent();
    });
  }

  cancel(): void {
    this.ref.close({ listChanged: false });
  }
}
