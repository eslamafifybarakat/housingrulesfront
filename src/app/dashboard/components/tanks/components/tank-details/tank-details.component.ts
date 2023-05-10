import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TanksService } from './../../../../services/tanks.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tank-details',
  templateUrl: './tank-details.component.html',
  styleUrls: ['./tank-details.component.scss']
})
export class TankDetailsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
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
  ) { }


  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.tankId = this.modalData?.id;
  }

  submit(): void {
    if (this.tankId) {
      let data = {
        name: this.modalData?.name,
        is_active: this.modalData?.is_active
      }
      this.tanksService?.addOrUpdateTank(data, this.tankId ? this.tankId : null)?.subscribe(
        (res: any) => {
          if (res?.code == 200) {
            this.ref.close({ listChanged: true });
            this.publicService?.show_loader?.next(false);
          } else {
            res?.message ? this.alertsService.openSnackBar(res?.message) : '';
            this.publicService?.show_loader?.next(false);
          }
        },
        (err: any) => {
          err?.message ? this.alertsService.openSnackBar(err?.message) : '';
          this.publicService?.show_loader?.next(false);
        });
    }
  }

  cancel(): void {
    this.ref.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
