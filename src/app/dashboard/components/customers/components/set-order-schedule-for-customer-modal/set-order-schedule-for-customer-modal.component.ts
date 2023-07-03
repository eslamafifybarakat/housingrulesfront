import { Subscription } from 'rxjs';
import { PublicService } from './../../../../../shared/services/public.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { SupervisorsService } from './../../../../services/supervisors.service';
import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-order-schedule-for-customer-modal',
  templateUrl: './set-order-schedule-for-customer-modal.component.html',
  styleUrls: ['./set-order-schedule-for-customer-modal.component.scss']
})
export class SetOrderScheduleForCustomerModalComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  modalData: any;

  minEndDate: any;
  isSelectStartDate: boolean = false;

  isLoadingPeriodicCatList: boolean = false;
  periodicCatList: any = [];
  isLoadingDayOfWeekList: boolean = false;
  dayOfWeekList: any = [];
  todayVal: any;

  constructor(
    public checkValidityService: CheckValidityService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.periodicCatList = this.publicService.getPeriodicCat();
    this.dayOfWeekList = this.publicService.getDayOfWeek();

    this.modalData = this.config?.data;
    console.log(this.modalData);
  }

  modalForm = this.fb?.group(
    {
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      time: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      periodicCat: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      dayOfWeek: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
    },
  );
  get formControls(): any {
    return this.modalForm?.controls;
  }

  selectStartDate(event: any): void {
    if (event) {
      this.minEndDate = event;
      this.isSelectStartDate = true;
    }
    this.modalForm?.get('endDate')?.reset();
  }
  clearStartDate(): void {
    this.isSelectStartDate = false;
    this.publicService?.removeValidators(this.modalForm, ['endDate']);
    this.modalForm?.get('endDate')?.reset();
  }


  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      let formInfo: any = this.modalForm?.value;
      myObject['startDate'] = formInfo?.startDate;
      myObject['endDate'] = formInfo?.endDate;
      myObject['supervisorId'] = formInfo?.supervisor?.id;
      myObject['driverId'] = formInfo?.driver?.id;
      myObject['orderStatus'] = formInfo?.orderStatus?.id;
      this.ref?.close(myObject)
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
