import { SheduleCreatedSuccessfullyComponent } from './../shedule-created-successfully/shedule-created-successfully.component';
import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { CustomersService } from 'src/app/dashboard/services/customers.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

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
  todayVal: any = new Date();

  constructor(
    public checkValidityService: CheckValidityService,
    private customersService: CustomersService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.periodicCatList = this.publicService.getPeriodicCat();
    this.dayOfWeekList = this.publicService.getDayOfWeek();
    this.modalData = this.config?.data;
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
      const startDateObj = new Date(formInfo?.startDate);
      const convertedStartDate = startDateObj?.toISOString();
      const endDateObj = new Date(formInfo?.endDate);
      const convertedEndDate = endDateObj?.toISOString();
      const TimeObj = new Date(formInfo?.endDate);
      const convertedTime = TimeObj?.toISOString();
      myObject['customerId'] = this.modalData?.item?.item?.id;
      myObject['startDue'] = convertedStartDate;
      myObject['endDue'] = convertedEndDate;
      myObject['timeVale'] = convertedTime?.split("T")[1]?.split(".")[0];
      myObject['period'] = formInfo?.periodicCat?.id;
      myObject['dayOrder'] = formInfo?.dayOfWeek?.id;
      this.publicService?.show_loader?.next(true);
      this.customersService?.createAsyncSchudle(myObject)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true && res?.statusCode == 200) {
            this.ref.close({ listChanged: true });
            this.publicService?.show_loader?.next(false);
            this.openSuccessfulModal();
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
      this.checkValidityService?.validateAllFormFields(this.modalForm);
    }
  }

  openSuccessfulModal() {
    const ref = this.dialogService?.open(SheduleCreatedSuccessfullyComponent, {
      dismissableMask: false,
      width: '40%',
      data: { id: this.modalData?.item?.item?.id }
    });
  }
  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
