import { ConfirmCompleteOrderComponent } from './../../../orders/components/confirm-complete-order/confirm-complete-order.component';
import { ReportsService } from './../../../../services/reports.service';
import { TanksService } from './../../../../services/tanks.service';
import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { SupervisorsService } from './../../../../services/supervisors.service';
import { DriversService } from './../../../../services/drivers.service';
import { patterns } from './../../../../../shared/configs/patternValidations';
import { Validators, FormBuilder } from '@angular/forms';
import { environment } from './../../../../../../environments/environment';
import { PusherService } from './../../../../../core/pusher/pusher.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrdersService } from './../../../../services/orders.service';
import { keys } from '../../../../../shared/configs/localstorage-key';
import { Observable, Subscription, finalize, map, timeout } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import * as signalR from '@microsoft/signalr';
import { Router, ActivatedRoute } from '@angular/router';
import { roots } from 'src/app/shared/configs/endPoints';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-daily-order-details',
  templateUrl: './daily-order-details.component.html',
  styleUrls: ['./daily-order-details.component.scss']
})
export class DailyOrderDetailsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  reportId: any;
  supervisorsList: any = [];
  isLoadingSupervisors: boolean = false;

  driversList: any = [];
  isLoadingDrivers: boolean = false;

  tanksList: any = [];
  isLoadingTanks: boolean = false;
  isSaving: boolean = false;

  paymentMethodsList: any = [
    { id: 1, value: 1, name: "Cash" },
    { id: 2, value: 2, name: "Mada" },
    { id: 3, value: 3, name: "Transfer" },
    { id: 4, value: 4, name: "Credit" }
  ]
  isLoadingPaymentMethods: boolean = false;

  orderOriginList: any = [];
  isLoadingOrderOrigin: boolean = false;

  propertyTypeList: any = [];
  isLoadingPropertyType: boolean = false;

  districtsList: any = [];
  isLoadingDistricts: boolean = false;
  customersList: any = [];
  isLoadingCustomers: boolean = false;

  currLang: any = '';
  tanksSize: any = [{ value: 1, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size15') },
  { value: 2, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size20') },
  { value: 3, name: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.Size32') }];
  isLoadingTanksSize: boolean = false;
  customerCanSubmitOrder: boolean = true;
  userData: any;
  minEndDate: any;
  isSelectStartDate: boolean = false;
  isLoadingFileDownload: boolean = false;


  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  loadingIndicator: boolean = false;
  orderDetailsList$!: Observable<any>;
  ordersCount: number = 0;
  tableHeaders: any = [];

  page: number = 1;
  perPage: number = 5;
  pagesCount: number = 0;
  rowsOptions: number[] = [5, 10, 15, 30];

  enableSortFilter: boolean = true;
  searchKeyword: any = null;
  filtersArray: any = [];
  sortObj: any = {};

  showActionTableColumn: boolean = false;
  showEditAction: boolean = false;
  showConfirmAction: boolean = false;
  showToggleAction: boolean = false;
  showActionFiles: boolean = false;

  paymentMethodList: any = [];

  userLoginDataType: any;

  currentActiveIndex: any = 1;
  startTime: any = null;
  endTime: any = null;
  supervisorId: any = null;
  driverId: any = null;
  orderStatus: any = null;
  private hubConnection: signalR.HubConnection | undefined;

  constructor(
    public checkValidityService: CheckValidityService,
    private supervisorsService: SupervisorsService,
    private activatedRoute: ActivatedRoute,
    private driversService: DriversService,
    private reportsService: ReportsService,
    private alertsService: AlertsService,
    private dialogService: DialogService,
    private ordersService: OrdersService,
    private pusherService: PusherService,
    public publicService: PublicService,
    private orderService: OrdersService,
    private tanksService: TanksService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.reportId = this.activatedRoute.snapshot.params?.['id'];

    this.userData = JSON.parse(window.localStorage.getItem(keys?.userLoginData) || '{}');

    this.startConnection();
    this.userLoginDataType = JSON.parse(window.localStorage.getItem(keys.userLoginData) || '{}')?.userType;
    if (this.userLoginDataType !== 9) {
      this.showActionTableColumn = true;
      this.showEditAction = true;
    }
    if (this.userLoginDataType == 7) {
      this.showActionTableColumn = true;
      this.showConfirmAction = true;
    }

    this.tableHeaders = [
      { field: 'orderNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderNumber'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderNumber'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'dateTime', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.time'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.time'), sort: false, filter: false, type: 'date' },
      { field: 'orderOrigin', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderOrigin'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderOrigin'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', isSelected: false },
      { field: 'createdByStr', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.createdBy'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.createdBy'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text', isSelected: false },
      { field: 'customer', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerName'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.customers'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'customerMobileNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerMobileNumber'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerMobileNumber'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'locationLink', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', enableItemLink: true, typeViewModal: 'location' },
      { field: 'supervisor', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisor'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisors'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'tankSize', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.tankSize'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.tankSize'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'driver', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.driver'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.drivers'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'status', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), filter: false, type: 'filterArray', dataType: 'array', list: 'orderStatus', placeholder: this.publicService?.translateTextFromJson('placeholder.status'), label: this.publicService?.translateTextFromJson('labels.status'), status: true },
      // { field: 'district', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.district'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.district'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      // { field: 'tank', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.tanks'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.tanks'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      // { field: 'propertyType', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.propertyType'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.propertyType'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'filterArray', dataType: 'array', list: 'propertyType', placeholder: this.publicService?.translateTextFromJson('placeholder.propertyType'), label: this.publicService?.translateTextFromJson('labels.propertyType') },
      // { field: 'paymentMethod', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.paymentMethod'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.paymentMethod'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'paidAmount', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.paidAmount'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.paidAmount'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'numeric' },
      // { field: 'cancellationCauses', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.cancellationCauses'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.cancellationCauses'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'closedAt', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.closedAt'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.closedAt'), sort: false, filter: true, type: 'date' },

    ];

    this.getOrdersReport();
    this.propertyTypeList = this.publicService?.getPropertyType();
    this.orderOriginList = this.publicService?.getOrderOrigin();
    this.paymentMethodList = this.publicService?.getPaymentMethods();

    this.getAllDistricts();
    this.getAllCustomers();
    this.getAllTanks();
  }

  orderForm = this.fb?.group(
    {
      orderNumber: ['', {
        validators: [], updateOn: "blur"
      }],

      paymentMethod: ['', {
        validators: [], updateOn: "blur"
      }],
      driver: [null, {
        validators: []
      }],
      tanks: [null, {
        validators: [Validators.required]
      }],
      orderOrigin: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],

      district: [null, {
        validators: [
          Validators.required,
          Validators?.minLength(3)]
      }],
      propertyType: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      tankSize: ['', {
        validators: [
          Validators.required]
      }],
      tankPrice: [0, []],
      customerName: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)]
      }],
      customerMobileNumber: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      supervisor: [null, {
        validators: [
          Validators.required]
      }],
      locationLink: ['', {
        validators: [
          Validators.pattern(patterns?.url)], updateOn: "blur"
      }],

      active: [false, []],
      startDate: [new Date(), [Validators.required]],
      endDate: [null, [Validators.required]],
    },
  );
  get formControls(): any {
    return this.orderForm?.controls;
  }

  getOrdersReport(): any {
    this.loadingIndicator = true;
    this.reportsService?.getOrdersReportList(this.page, this.perPage,
      this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null,
      this.filtersArray ? this.filtersArray : null, this.currentActiveIndex,
      this.startTime, this.endTime, this.supervisorId, this.driverId, this.orderStatus)
      .pipe(
        map((res: any) => {
          this.ordersCount = res?.total;
          this.pagesCount = Math.ceil(this.ordersCount / this.perPage);
          let arr: any = [];
          res?.data ? res?.data.forEach((item: any) => {
            let status: any = '';
            let statusClass: any = '';
            if (item?.status == 1) {
              status = this.publicService.translateTextFromJson('general.pending');
              statusClass = 'warning';
            }
            if (item?.status == 2) {
              status = this.publicService.translateTextFromJson('general.assignedToDriver');
              statusClass = 'primary';
            }
            if (item?.status == 3) {
              status = this.publicService.translateTextFromJson('general.driverOnWayToCustomer');
              statusClass = 'gray';
            }
            if (item?.status == 4) {
              status = this.publicService.translateTextFromJson('general.driverArrivedToCustomer');
              statusClass = 'cyan';
            }
            if (item?.status == 5) {
              status = this.publicService.translateTextFromJson('general.driverOnWayToStation');
              statusClass = 'purple';
            }
            if (item?.status == 6) {
              status = this.publicService.translateTextFromJson('general.driverArrivedToStation');
              statusClass = 'cyan';
            }
            if (item?.status == 7) {
              status = this.publicService.translateTextFromJson('general.completed');
              statusClass = 'success';
            }
            if (item?.status == 8) {
              status = this.publicService.translateTextFromJson('general.cancelled');
              statusClass = 'danger';
            }
            let orderOrigin: any;
            this.orderOriginList?.forEach((element: any) => {
              if (element?.value == item?.orderOrigin) {
                orderOrigin = element?.name
              }
            });
            let propertyType: any = [];
            this.propertyTypeList?.forEach((element: any) => {
              if (element?.value == item?.propertyType) {
                propertyType?.push(element);
              }
            });
            let paymentMethod: any = '';
            this.paymentMethodList?.forEach((element: any) => {
              if (element?.value == item?.paymentMethod) {
                paymentMethod = element?.name;
              }
            });
            let sizeTank: any;
            if (item?.tankSize == 1) {
              sizeTank = "Size15";
            }
            if (item?.tankSize == 2) {
              sizeTank = "Size20";
            }
            if (item?.tankSize == 3) {
              sizeTank = "Size32";
            }
            arr.push({
              id: item?.id ? item?.id : null,
              dateTime: item?.dateTime ? new Date(item?.dateTime) : null,
              orderOrigin: orderOrigin,
              createdByStr: item?.createdByStr ? item?.createdByStr : '',
              orderNumber: item?.orderNumber ? item?.orderNumber : '',
              propertyType: propertyType,
              customerMobileNumber: item?.customerMobileNumber ? item?.customerMobileNumber : '',
              district: item?.district ? item?.district : '',
              locationLink: item?.locationLink ? item?.locationLink : null,
              tankSize: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.' + sizeTank),
              status: status,
              statusClass: statusClass,
              paymentMethod: paymentMethod,
              paidAmount: item?.paidAmount ? item?.paidAmount : '0',
              cancellationCauses: item?.cancellationCauses ? item?.cancellationCauses : '',
              closedAt: item?.closedAt ? item?.closedAt : '',
              supervisor: item?.supervisor ? item?.supervisor : [],
              driver: item?.driver ? item?.driver : [],
              customer: item?.customer ? item?.customer : '',
              comments: item?.comments ? item?.comments : '',

            });
          }) : '';
          this.orderDetailsList$ = arr;
        }),
        finalize(() => {
          this.loadingIndicator = false;
          this.isLoadingSearch = false;
          this.enableSortFilter = false;
          setTimeout(() => {
            this.enableSortFilter = true;
          }, 200);
        })

      ).subscribe((res: any) => {
      });
  }
  handleChange(e: any): void {
    var index = e.index;
    this.currentActiveIndex = index + 1;
    this.getOrdersReport();
  }
  getOrders(): void {
    let arr: any = this.orderDetailsList$
    arr?.length == 0 ? this.getOrdersReport() : '';
  }

  search(event: any): void {
    this.isLoadingSearch = true;
    this.searchKeyword = event;
    if (event?.length > 0) {
      this.isSearch = true;
    }
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getOrdersReport();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getOrdersReport();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.ordersCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
  }

  viewLocation(item: any): void {
    item?.locationLink ? window?.open(item?.locationLink, "_blank") : '';
  }

  clearTable(event: any): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getOrdersReport();
  }
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getOrdersReport();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getOrdersReport();
    }
  }
  filterItems(event: any): void {
    this.filtersArray = [];
    Object.keys(event)?.forEach((key: any) => {
      this.tableHeaders?.forEach((colHeader: any) => {
        if (colHeader?.field == key) {
          event[key]?.forEach((record: any) => {
            record['type'] = colHeader?.type;
          });
        }
      });
    });
    Object.keys(event).forEach((key: any) => {
      event[key]?.forEach((record: any) => {
        if (record['type'] && record['value'] !== null) {
          let filterData;
          if (record['type'] == 'text' || record['type'] == 'date' || record['type'] == 'numeric' || record['type'] == 'status') {
            let data: any;
            if (record['type'] == 'date') {
              data = new Date(record?.value?.setDate(record?.value?.getDate() + 1));
              record.value = new Date(record?.value?.setDate(record?.value?.getDate() - 1));
            } else {
              data = record?.value;
            }

            filterData = {
              column: key,
              type: record?.type,
              data: data,
              operator: record?.matchMode
            }
          }

          else if (record['type'] == 'filterArray') {
            let arr: any = [];
            record?.value?.forEach((el: any) => {
              arr?.push(el?.id || el?.value);
            });
            if (arr?.length > 0) {
              filterData = {
                column: key,
                type: 'relation',
                data: arr
              }
            }
          }
          else if (record['type'] == 'boolean') {
            filterData = {
              column: key,
              type: record?.type,
              data: record?.value
            }
          }
          if (filterData) {
            this.filtersArray?.push(filterData);
          }
        }
      });
    });
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getOrdersReport();
  }
  removeFilteredData(): void {
    this.startTime = null;
    this.endTime = null;
    this.supervisorId = null,
      this.driverId = null;
    this.orderStatus = null;
    this.getOrdersReport();
  }

  public startConnection = () => {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 4) + '/OrderStatusHub';
    this.hubConnection = new signalR.HubConnectionBuilder().withAutomaticReconnect()
      .withUrl(url)
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = 100000; // 100 second
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('NotifyNewOrderCreated', (data, user) => {
      this.getOrdersReport();
    });
    this.hubConnection.on('NotifyOrderStatus', (orderId, orderStatus) => {
      this.updateOrderStatus(orderId, orderStatus);
    });
  }
  updateOrderStatus(orderId: any, orderStatus: any) {
    let statustobind: any;
    let statusClass: any;
    this.orderDetailsList$?.forEach((element: any) => {
      if (orderId == element?.id) {

        if (orderStatus == 1) {
          statustobind = this.publicService.translateTextFromJson('general.pending');
          statusClass = 'warning';
        }
        if (orderStatus == 2) {
          statustobind = this.publicService.translateTextFromJson('general.assignedToDriver');
          statusClass = 'primary';
        }
        if (orderStatus == 3) {
          statustobind = this.publicService.translateTextFromJson('general.driverOnWayToCustomer');
          statusClass = 'gray';
        }
        if (orderStatus == 4) {
          statustobind = this.publicService.translateTextFromJson('general.driverArrivedToCustomer');
          statusClass = 'cyan';
        }
        if (orderStatus == 5) {
          statustobind = this.publicService.translateTextFromJson('general.driverOnWayToStation');
          statusClass = 'purple';
        }
        if (orderStatus == 6) {
          statustobind = this.publicService.translateTextFromJson('general.driverArrivedToStation');
          statusClass = 'cyan';
        }
        if (orderStatus == 7) {
          statustobind = this.publicService.translateTextFromJson('general.completed');
          statusClass = 'success';
        }
        if (orderStatus == 8) {
          statustobind = this.publicService.translateTextFromJson('general.cancelled');
          statusClass = 'danger';
        }
        element["status"] = statustobind;
        element["statusClass"] = statusClass;
      }
    });

    this.cdr.detectChanges();
  }


  downloadOrdersFile(): void {
    // this.isLoadingFileDownload = true;
    // this.publicService?.downloadExampleFn(roots?.dashboard?.reports?.downloadOrdersExample)?.subscribe(
    //   (response: Blob) => {
    //     saveAs(response, 'banks.xlsx');
    //   },
    //   (err: any) => {
    //     err?.message ? this.alertsService.openSnackBar(err?.message) : '';
    //     this.isLoadingFileDownload = false;
    //   });
    // this.cdr?.detectChanges();
  }
  getAllDistricts(): any {
    this.isLoadingDistricts = true;
    this.orderService?.getDistrictsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.districtsList = res?.data[0]?.districts;
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
  onChangeDistrict(item: any): void {
    if (item?.value?.id) {
      this.getSupervisorsByDistrictId(item?.value?.id);
      this.orderForm?.patchValue({
        supervisor: null
      });
      this.orderForm?.controls?.supervisor?.enable();
    }
  }
  onClearDistrict(): void {
    this.orderForm?.patchValue({
      supervisor: null,
      driver: null
    });
    this.supervisorsList = [];
    this.driversList = [];

    this.orderForm?.controls?.supervisor?.disable();
    this.orderForm?.controls?.driver?.disable();
  }

  onChangeSupervisor(item: any): void {
    if (item?.value?.id) {
      this.getDriversBysuperVisorId(item?.value?.id);
      this.orderForm?.patchValue({
        driver: null
      });
      this.orderForm?.controls?.driver?.enable();
    }
  }
  onClearSupervisor(): void {
    this.orderForm?.patchValue({
      driver: null
    });
    this.driversList = [];
    this.orderForm?.controls?.driver?.disable();
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
  addNewCustomer(item?: any, type?: any): void {
    // const ref = this.dialogService?.open(AddEditCustomerComponent, {
    //   data: {
    //     item,
    //     type: type == 'edit' ? 'edit' : 'add'
    //   },
    //   header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.customers.editCustomer') : this.publicService?.translateTextFromJson('dashboard.customers.addCustomer'),
    //   dismissableMask: false,
    //   width: '40%',
    //   styleClass: 'custom_modal'
    // });
    // ref.onClose.subscribe((res: any) => {
    //   if (res?.listChanged) {
    //     this.customersList.push(res?.item);
    //     this.orderForm?.patchValue({
    //       customerName: res?.item,
    //       customerMobileNumber: res?.item?.mobileNumber
    //     });
    //     this.cdr?.detectChanges();
    //   }
    // });
  }

  onSelectCustomer(): void {
    let formInfo: any = this.orderForm?.value?.customerName;
    this.customerCanSubmitOrder = true;

    this.orderForm?.patchValue({
      customerMobileNumber: formInfo?.mobileNumber
    });
    // this.customersService.canCustomerSubmitOrder(formInfo.id).subscribe(
    //   (res: any) => {
    //     if (res?.isSuccess == true && res?.statusCode == 200) {
    //       this.publicService?.show_loader?.next(false);
    //       if (res?.data == false){
    //         this.customerCanSubmitOrder = false;
    //       }
    //     } else {
    //       res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
    //       this.publicService?.show_loader?.next(false);
    //     }
    //     this.isSaving = false;
    //   },
    //   (err: any) => {
    //     err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
    //     this.publicService?.show_loader?.next(false);
    //     this.isSaving = false;

    //   });
  }
  onClearCustomer(): void {
    this.orderForm?.patchValue({
      customerMobileNumber: null
    });
    this.customerCanSubmitOrder = true;

  }

  getSupervisorsByDistrictId(districtId: any): any {
    this.isLoadingSupervisors = true;
    this.supervisorsService?.getSupervisorsByDistrictId(districtId)?.subscribe(
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
  getDriversBysuperVisorId(superVisorId: any): any {
    // if ((this.userData?.userType == 2 || this.userData?.userType == 4)) {
    this.isLoadingDrivers = true;
    this.driversService?.getDriversBysuperVisorId(superVisorId)?.subscribe(
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

    // }
  }
  getAllTanks(): any {
    this.isLoadingTanks = true;
    this.tanksService?.getTanksList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          res?.data ? res?.data?.forEach((tank: any) => {
            // let sizeTank: any;
            // if (tank?.tankSize == 0) {
            //   sizeTank = "Size13";
            // }
            // if (tank?.tankSize == 1) {
            //   sizeTank = "Size20";
            // }
            // if (tank?.tankSize == 2) {
            //   sizeTank = "Size32";
            // }
            // let tankSize = this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.' + sizeTank)
            this.tanksList?.push({
              price: tank?.price,
              name: tank?.name,
              // name: tankSize + " - " + tank?.name,
              id: tank?.id
            });
          }) : '';

          this.isLoadingTanks = false;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoadingTanks = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoadingTanks = false;
      });
    this.cdr?.detectChanges();
  }
  onTankChange(item: any): void {
    let price: any = 0;
    switch (item.value) {
      case 1:
        price = 80;
        break;
      case 2:
        price = 110;
        break;
      case 3:
        price = 176;
        break;
    }
    this.orderForm?.patchValue({
      tankPrice: price
    });
  }
  onTankClear(): void {
    this.orderForm?.patchValue({
      tankPrice: null
    });
  }
  selectStartDate(event: any): void {
    if (event) {
      this.minEndDate = event;
      this.isSelectStartDate = true;
    }
    this.orderForm?.get('endDate')?.reset();
  }
  clearStartDate(): void {
    this.isSelectStartDate = false;
    this.publicService?.removeValidators(this.orderForm, ['endDate']);
    this.orderForm?.get('endDate')?.reset();
  }

  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.orderForm?.valid) {
      this.isSaving = true;
      let date: Date = new Date();
      let formInfo: any = this.orderForm?.value;
      myObject['dateTime'] = date;
      myObject['orderOrigin'] = formInfo?.orderOrigin?.['value'];
      myObject['propertyType'] = formInfo?.propertyType?.['value'];
      myObject['customerMobileNumber'] = formInfo?.customerMobileNumber;
      myObject['districtId'] = formInfo?.district?.['id'];
      myObject['locationLink'] = formInfo?.locationLink;
      myObject['supervisorId'] = formInfo?.supervisor?.['id'];
      myObject['driverId'] = formInfo?.driver?.id;
      myObject['customerId'] = formInfo?.customerName?.id;
      myObject['tankSize'] = formInfo?.tankSize.value;
      myObject['tankId'] = formInfo?.tanks.value?.id;
      myObject['paymentMethod'] = formInfo?.paymentMethod?.['value'];
      myObject['startDate'] = formInfo?.startDate;
      myObject['endDate'] = formInfo?.endDate;

      if (this.userData?.userType == 7) {
        this.publicService?.show_loader?.next(true);
        this.reportsService?.orderSearch(myObject, this.reportId ? this.reportId : null)?.subscribe(
          (res: any) => {
            if (res?.isSuccess == true && res?.statusCode == 200) {
              this.publicService?.show_loader?.next(false);
              res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
              this.getOrdersReport();
            } else {
              res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
              this.publicService?.show_loader?.next(false);
            }
          },
          (err: any) => {
            err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
            this.publicService?.show_loader?.next(false);
          });
      }
      else {
        this.reportsService?.orderSearch(myObject, this.reportId ? this.reportId : null)?.subscribe(
          (res: any) => {
            if (res?.isSuccess == true && res?.statusCode == 200) {
              this.publicService?.show_loader?.next(false);
              res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
              this.getOrdersReport();
            } else {
              res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
              this.publicService?.show_loader?.next(false);
            }
            this.isSaving = false;
          },
          (err: any) => {
            err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
            this.publicService?.show_loader?.next(false);
            this.isSaving = false;

          });
      }
    } else {
      this.checkValidityService?.validateAllFormFields(this.orderForm);
    }
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
