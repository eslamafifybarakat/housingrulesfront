
import { OrdersService } from './../../services/orders.service';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { Router } from '@angular/router';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { PublicService } from 'src/app/shared/services/public.service';
import { FormBuilder } from '@angular/forms';
import { CheckValidityService } from 'src/app/shared/services/check-validity/check-validity.service';
import { DriversService } from '../../services/drivers.service';
import { SupervisorsService } from '../../services/supervisors.service';
import { keys } from 'src/app/shared/configs/localstorage-key';
import { ServiceAgentService } from '../../services/service-agent.service';
import * as moment from 'moment';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  srcUrl = '';
  currLang: any = '';
  isLoadingSearch: boolean = false;

  isFullLoading: boolean = false;
  reportsCount: any = 7;
  reportsList: any = [];
  selectedReport!: number;
  repcode!: number;
  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  driversList: any = [];
  isLoadingDrivers: boolean = false;

  districtsList: any = [];
  isLoadingDistricts: boolean = false;
  customersList: any = [];
  isLoadingCustomers: boolean = false;
  serviceAgentsList: any = [];
  isLoadingServiceAgents: boolean = false;

  orderStatusList: any = [];
  isLoadingDriverStatus: boolean = false;

  minEndDate: any;
  isSelectStartDate: boolean = false;
  repentityname: any;

  page: number = 1;
  perPage: number = 30;
  pagesCount: number = 0;
  rowsOptions: number[] = [5, 10, 15, 30];

  enableSortFilter: boolean = true;
  searchKeyword: any = null;
  filtersArray: any = [];
  sortObj: any = {};

  currentActiveIndex: any = 1;
  startTime: any = null;
  endTime: any = null;
  supervisorId: any = null;
  driverId: any = null;
  districtId: any = null;
  customerId: any = null;
  serviceAgentId: any = null;
  orderStatus: any = null;
  ordersList$!: Observable<any>;
  dateFrom: Date = new Date();

  modalForm = this.fb?.group(
    {
      startDate: [new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), 1), []],
      endDate: [new Date(this.dateFrom.getFullYear(),this.dateFrom.getMonth() + 1, 0), []],
      supervisor: ['', []],
      driver: ['', []],
      district: ['', []],
      serviceAgent: ['', []],
      customerName: ['', []],
      orderStatus: ['', []],
    },
  );
  repSections: any[] = [
    { name: this.publicService?.translateTextFromJson('dashboard.orders.orders'), value: 1 },
    { name: this.publicService?.translateTextFromJson('dashboard.supervisors.supervisors'), value: 2 },
    { name: this.publicService?.translateTextFromJson('dashboard.drivers.drivers'), value: 3 },
    { name: this.publicService?.translateTextFromJson('dashboard.customers.customers'), value: 4 }
  ];
  ordersrepSections: any[] = [
    { name: this.publicService?.translateTextFromJson('dashboard.orders.all'), value: 1 },
    { name: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisor'), value: 2 },
    { name: this.publicService?.translateTextFromJson('dashboard.tableHeader.driver'), value: 3 },
    { name: this.publicService?.translateTextFromJson('placeholder.customer'), value: 4 },
    { name: this.publicService?.translateTextFromJson('dashboard.tableHeader.district'), value: 5 },
    { name: this.publicService?.translateTextFromJson('dashboard.serviceAgent.serviceAgent'), value: 6 }
  ];
  constructor(
    private reportsService: ReportsService,
    private supervisorsService: SupervisorsService,
    private driversService: DriversService,
    private orderService: OrdersService,
    private serviceAgentService: ServiceAgentService,
    public checkValidityService: CheckValidityService,
    public publicService: PublicService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.getReportsCategory();
    this.currLang = window.localStorage.getItem(keys?.language);
  }

  getReportsCategory(): void {
    this.isFullLoading = true;
    this.reportsService?.getReportsCategory()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.reportsList = res?.data ? res?.data : null;
          this.isFullLoading = false;
        } else {
          res?.message ? this.alertsService.openSweetAlert('info', res?.message) : '';
          this.isFullLoading = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService.openSweetAlert('error', err?.message) : '';
        this.isFullLoading = false;
      });
    this.cdr?.detectChanges();

    this.reportsList = [
      { name: 'Order reports', id: 1, reports: [{ id: 1, name: 'تفاصيل الطلبات اليومية' }, { id: 2, name: 'عدد الطلبات الاجمال حسب الاحياء' }, { id: 3, name: 'تفاصيل الطلبات اليومية' }, { id: 4, name: 'عدد الطلبات الاجمال حسب الاحياء' }] },
      { name: 'Operations', id: 2, reports: [{ id: 4, name: 'Daily order details' }] },
      { name: 'Tankers', id: 3, reports: [{ id: 7, name: 'Total number of applications by district' }] },
      { name: ' Financial reports', id: 5, reports: [{ id: 8, name: 'Daily order details' }, { id: 10, name: 'Total number of applications by district' }] },
    ];

  }

  reportDetails(item: any): void {
    this.router?.navigate(['/dashboard/daily-order-details', { id: item?.id, name: item?.name }])
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }

  get formControls(): any {
    return this.modalForm?.controls;
  }
  selectStartDate(event: any): void {
    if (event) {
      this.minEndDate = event;
      this.isSelectStartDate = true;
    }
  }
  clearStartDate(): void {
    this.isSelectStartDate = false;
    this.publicService?.removeValidators(this.modalForm, ['endDate']);
    this.modalForm?.get('endDate')?.reset();
  }
  submit(): void {

    let formInfo: any = this.modalForm?.value;
    switch (this.repcode) {
      case 2:
        this.repentityname = formInfo?.supervisor?.name;
        break;
      case 3:
        this.repentityname = formInfo?.driver?.name;
        break;
      case 4:
        this.repentityname = formInfo?.serviceAgent?.name;
        break;
      case 5:
        this.repentityname = formInfo?.district?.name;
        break;
      case 6:
        this.repentityname = formInfo?.serviceAgent?.name;
        break;
      default:
        break;
    }
    this.getAllOrders();

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
          this.modalForm?.patchValue({
            supervisor: supervisor
          })
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
  getAllDrivers(): any {
    this.isLoadingDrivers = true;
    this.driversService?.getDriversList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          let arr: any = [];
          res?.data ? res?.data?.forEach((item: any) => {
            arr?.push({
              name: item?.arName,
              id: item?.id
            });
          }) : '';
          this.driversList = arr;
          this.isLoadingDrivers = false;
          let driver: any = null;

          this.modalForm?.patchValue({
            driver: driver
          })
        } else {
          res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
          this.isLoadingDrivers = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSnackBar(err?.message) : '';
        this.isLoadingDrivers = false;
      });
    this.cdr?.detectChanges();
  }
  getAllDistricts(): any {
    this.isLoadingDistricts = true;
    this.orderService?.getDistrictsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.districtsList = res?.data[0].districts;

          this.isLoadingDistricts = false;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoadingDistricts = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoadingDistricts = false;
      });
    this.cdr?.detectChanges();
  }
  getAllCustomers(): any {
    this.isLoadingCustomers = true;
    this.orderService?.getCustomersList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.customersList = res?.data;

          this.isLoadingCustomers = false;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoadingCustomers = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoadingCustomers = false;
      });
    this.cdr?.detectChanges();

  }

  getAllServiceAgents(): any {
    this.isLoadingServiceAgents = true;
    this.serviceAgentService?.getServiceAgentsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          let arr: any = [];
          res?.data ? res?.data?.forEach((serviceAgent: any) => {
            arr?.push({
              name: serviceAgent?.arName,
              id: serviceAgent?.id
            });
          }) : '';
          this.serviceAgentsList = arr;
          this.isLoadingServiceAgents = false;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoadingServiceAgents = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoadingServiceAgents = false;
      });
    this.cdr?.detectChanges();
  }

  loadRelatedData(event: any): void {
    this.modalForm?.patchValue({
      supervisor: null,
      district: null,
      driver: null,
    })
    switch (Number.parseInt(event.value)) {
      case 2:
        this.getAllSupervisors();
        break;
      case 3:
        this.getAllDrivers();
        break;
      case 4:
        this.getAllCustomers();
        break;
      case 5:
        this.getAllDistricts();
        break;
      case 6:
        this.getAllServiceAgents();
        break;
      default:
        break;
    }
  }
  getAllOrders(): any {
    let formInfo: any = this.modalForm?.value;

    this.startTime = formInfo?.startDate;
    this.endTime = formInfo?.endDate;
    this.supervisorId = formInfo?.supervisor?.id;
    this.districtId = formInfo?.district?.id;
    this.driverId = formInfo?.driver?.id;
    this.customerId = formInfo?.customerName?.id;
    this.serviceAgentId  = formInfo?.serviceAgent?.id;
    this.orderStatus = 0;
    let localurl = this.orderService?.getOrdersforreports(this.currentActiveIndex,
      this.startTime, this.endTime, this.supervisorId, this.driverId, this.districtId, this.orderStatus,this.customerId,
      this.serviceAgentId);

      let tenantidKey = window.localStorage.getItem(keys.tenantid);


    let apiURL = 'http://qa-tms.qatarcentral.cloudapp.azure.com:4488/viewer?reportname=orders' +
      '&rowfrom=' + moment(this.startTime).format('YYYYMMDD') +
      '&rowto=' + moment(this.endTime).format('YYYYMMDD') +
      '&repentityname=' + this.repentityname +
      '&repcode=' + this.repcode +
      '&data=' + JSON.stringify(localurl);
      if (tenantidKey) {
        apiURL = apiURL +   '&tenantid=' +tenantidKey;
      }
    this.srcUrl = apiURL


  }
  private formatDate(date:string
    ) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
}

