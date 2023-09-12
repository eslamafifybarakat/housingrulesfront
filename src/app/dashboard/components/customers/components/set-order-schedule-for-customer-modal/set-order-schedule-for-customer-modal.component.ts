import { SheduleCreatedSuccessfullyComponent } from './../shedule-created-successfully/shedule-created-successfully.component';
import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { OrderSheduleComponent } from '../order-shedule/order-shedule.component';
import { CustomersService } from 'src/app/dashboard/services/customers.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';

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
  isLoading: boolean = false;
  orderSchedule: any = [];
  tableHeaders: any = [];


  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  constructor(
    public checkValidityService: CheckValidityService,
    private customersService: CustomersService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private supervisorsService: SupervisorsService,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getAllSupervisors();
    this.periodicCatList = this.publicService?.getPeriodicCat();
    this.dayOfWeekList = this.publicService?.getDayOfWeek();
    this.modalData = this.config?.data;
    this.getByIdAsyncOrderSchedule(this.modalData?.item?.item?.id);
    this.tableHeaders = [
      { field: 'dayOrder', header: this.publicService?.translateTextFromJson('labels.dayOfWeek'), title: this.publicService?.translateTextFromJson('labels.dayOfWeek'), type: 'text' },
      { field: 'period', header: this.publicService?.translateTextFromJson('labels.periodicCat'), title: this.publicService?.translateTextFromJson('labels.periodicCat'), type: 'text' },
      { field: 'timeVale', header: this.publicService?.translateTextFromJson('labels.time'), title: this.publicService?.translateTextFromJson('labels.time'), type: 'text' },
      { field: 'startDue', header: this.publicService?.translateTextFromJson('labels.startDate'), title: this.publicService?.translateTextFromJson('labels.startDate'), type: 'date' },
      { field: 'endDue', header: this.publicService?.translateTextFromJson('labels.endDate'), title: this.publicService?.translateTextFromJson('labels.endDate'), type: 'date' },
    ];
  }

  modalForm = this.fb?.group(
    {
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      time: [new Date(0, 0, 0, 0, 0), {
        validators: [
          Validators.required]
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
  getByIdAsyncOrderSchedule(id: any): void {
    this.isLoading = true;
    this.customersService?.getByIdAsyncOrderSchedule(id)?.subscribe(
      (res: any) => {
        if (res?.isSuccess == true && res?.statusCode == 200) {
          this.isLoading = false;
          let arr = [];
          arr = res?.data ? res?.data : [];
          arr?.forEach((item: any) => {
            let period = null;
            let dayOrder = null;
            this.periodicCatList?.forEach((element: any) => {
              if (item?.period == element?.id) {
                period = element?.name;
              }
            });
            this.dayOfWeekList?.forEach((element: any) => {
              if (item?.dayOrder == element?.id) {
                dayOrder = element?.name;
              }
            });
            if (item?.timeVale != null) {
              this.orderSchedule?.push({
                startDue: item?.startDue,
                endDue: item?.endDue,
                timeVale: this.publicService?.getFormattedTime(item?.timeVale),
                period: period,
                dayOrder: dayOrder
              });
            }
          });
          console.log(this.orderSchedule);

        } else {
          this.isLoading = false;
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
        }
      },
      (err: any) => {
        this.isLoading = false;
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
      });
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
  getAllSupervisors(): any {
    this.isLoadingSupervisors = true;
    this.supervisorsService?.getSupervisorsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          let arr: any = [];
          res?.data ? res?.data?.forEach((supervisor: any) => {
            arr?.push({
              name: supervisor?.arName,
              id: supervisor?.id
            });
          }) : '';
          this.supervisorsList = arr;
          this.isLoadingSupervisors = false;
          let supervisor: any = null;
          this.supervisorsList?.forEach((item: any) => {
            if (item?.id == this.modalData?.supervisorId) {
              supervisor = item;
            }
          });

        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoadingSupervisors = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoadingSupervisors = false;
      });
    this.cdr?.detectChanges();
  }
  browse(): void {
    this.ref?.close();
    const ref = this.dialogService?.open(OrderSheduleComponent, {
      dismissableMask: true,
      width: '100%',
      height: '100%',
      styleClass: 'shedule-dialog',
      data: this.modalData
    });
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
