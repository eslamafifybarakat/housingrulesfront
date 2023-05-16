import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../shared/services/public.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrdersService } from './../../services/orders.service';
import { keys } from '../../../shared/configs/localstorage-key';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { ConfirmOrderComponent } from './components/confirm-order/confirm-order.component';

@Component({
  selector: 'app-settlementes',
  templateUrl: './settlementes.component.html',
  styleUrls: ['./settlementes.component.scss']
})
export class SettlementesComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  loadingIndicator: boolean = false;
  settlementesList$!: Observable<any>;
  settlementesCount: number = 0;
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
  showConfirmAction: boolean = false;
  showEditAction: boolean = false;
  showToggleAction: boolean = false;
  showActionFiles: boolean = false;

  paymentMethodList: any = [];

  userLoginDataType: any;

  constructor(
    private alertsService: AlertsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userLoginDataType = JSON.parse(window.localStorage.getItem(keys.userLoginData) || '{}')?.userType;
    if (this.userLoginDataType == 7) {
    }
    this.showActionTableColumn = true;
    this.showConfirmAction = true;

    this.tableHeaders = [
      { field: 'orderNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderNumber'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderNumber'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'dateTime', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.date'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.date'), sort: false, filter: false, type: 'date' },
      { field: 'orderOrigin', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderOrigin'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderOrigin'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'createdByName', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.createdBy'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.createdBy'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'customer', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerName'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.customers'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'customerMobileNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerMobileNumber'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerMobileNumber'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'locationLink', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', enableItemLink: true, typeViewModal: 'location' },
      { field: 'supervisor', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisor'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisors'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      // { field: 'driver', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.driver'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.drivers'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'status', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), filter: false, type: 'filterArray', dataType: 'array', list: 'orderStatus', placeholder: this.publicService?.translateTextFromJson('placeholder.status'), label: this.publicService?.translateTextFromJson('labels.status'), status: true },
      // { field: 'district', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.district'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.district'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      // { field: 'tank', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.tanks'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.tanks'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      // { field: 'propertyType', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.propertyType'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.propertyType'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'filterArray', dataType: 'array', list: 'propertyType', placeholder: this.publicService?.translateTextFromJson('placeholder.propertyType'), label: this.publicService?.translateTextFromJson('labels.propertyType') },
      // { field: 'tankSize', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.tankSize'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.tankSize'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'paymentMethod', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.paymentMethod'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.paymentMethod'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'paidAmount', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.paidAmount'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.paidAmount'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'numeric' },
      // { field: 'cancellationCauses', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.cancellationCauses'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.cancellationCauses'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'closedAt', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.closedAt'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.closedAt'), sort: false, filter: true, type: 'date' },

    ];

    this.getAllSettlementes();
    this.paymentMethodList = this.publicService?.getPaymentMethods();
  }

  getAllSettlementes(): any {
    this.loadingIndicator = true;
    this.ordersService?.getSettlementesList(this.page, this.perPage, this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null, this.filtersArray ? this.filtersArray : null)
      .pipe(
        map((res: any) => {
          this.settlementesCount = res?.total;
          this.pagesCount = Math.ceil(this.settlementesCount / this.perPage);
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
            let paymentMethod: any = '';
            this.paymentMethodList?.forEach((element: any) => {
              if (element?.value == item?.paymentMethod) {
                paymentMethod = element?.name;
              }
            });
            arr.push({
              id: item?.id ? item?.id : null,
              dateTime: item?.dateTime ? new Date(item?.dateTime) : null,
              createdByName: item?.createdByName ? item?.createdByName : '',
              orderNumber: item?.orderNumber ? item?.orderNumber : '',
              customerMobileNumber: item?.customerMobileNumber ? item?.customerMobileNumber : '',
              district: item?.district ? item?.district : '',
              locationLink: item?.locationLink ? item?.locationLink : null,
              tank: item?.tank ? item?.tank : '',
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
          this.settlementesList$ = arr;
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
  getOrders(): void {
    let arr: any = this.settlementesList$
    arr?.length == 0 ? this.getAllSettlementes() : '';
  }

  search(event: any): void {
    this.isLoadingSearch = true;
    this.searchKeyword = event;
    if (event?.length > 0) {
      this.isSearch = true;
    }
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllSettlementes();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllSettlementes();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.settlementesCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
  }
  viewLocation(item: any): void {
    console.log(item?.locationLink);
    item?.locationLink ? window?.open(item?.locationLink, "_blank") : '';
  }

  confirmOrder(item?: any): void {
    console.log(item);
    const ref = this.dialogService?.open(ConfirmOrderComponent, {
      data: {
        item: item
      },
      header: this.publicService?.translateTextFromJson('general.confirm_order'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.page = 1;
        this.publicService?.changePageSub?.next({ page: this.page });
        this.getAllSettlementes();
      }
    });

  }

  clearTable(event: any): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllSettlementes();
  }
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllSettlementes();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllSettlementes();
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
    this.getAllSettlementes();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
