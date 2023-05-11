import { Router } from '@angular/router';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../shared/services/public.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrdersService } from './../../services/orders.service';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { FilterOrdersComponent } from './components/filter-orders/filter-orders.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  loadingIndicator: boolean = false;
  ordersList$!: Observable<any>;
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
  showToggleAction: boolean = false;
  showActionFiles: boolean = false;

  constructor(
    private alertsService: AlertsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      { field: 'dateTime', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.date'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.date'), sort: false, filter: true, type: 'date' },
      { field: 'orderOrigin', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderOrigin'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderOrigin'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'propertyType', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.propertyType'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.propertyType'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'filterArray', dataType: 'array', list: 'propertyType', placeholder: this.publicService?.translateTextFromJson('placeholder.propertyType'), label: this.publicService?.translateTextFromJson('labels.propertyType') },
      { field: 'customerMobileNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerMobileNumber'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerMobileNumber'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'district', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.district'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.district'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'locationLink', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', enableItemLink: true },
      { field: 'tank', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.tanks'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.tanks'), filter: true, type: 'filterArray', dataType: 'array', list: 'tanks', placeholder: this.publicService?.translateTextFromJson('placeholder.tank'), label: this.publicService?.translateTextFromJson('labels.tank') },
      // { field: 'tankSize', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.tankSize'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.tankSize'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'status', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), filter: true, type: 'filterArray', dataType: 'array', list: 'orderStatus', placeholder: this.publicService?.translateTextFromJson('placeholder.status'), label: this.publicService?.translateTextFromJson('labels.status'), status: true },
      { field: 'paymentMethod', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.paymentMethod'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.paymentMethod'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'paidAmount', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.paidAmount'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.paidAmount'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'numeric' },
      { field: 'cancellationCauses', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.cancellationCauses'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.cancellationCauses'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'closedAt', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.closedAt'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.closedAt'), sort: false, filter: true, type: 'date' },
      { field: 'drivers', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.drivers'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.drivers'), filter: true, type: 'filterArray', dataType: 'array', list: 'drivers', placeholder: this.publicService?.translateTextFromJson('placeholder.driver'), label: this.publicService?.translateTextFromJson('labels.driver') },
      { field: 'supervisors', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisors'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisors'), filter: true, type: 'filterArray', dataType: 'array', list: 'supervisors', placeholder: this.publicService?.translateTextFromJson('placeholder.supervisor'), label: this.publicService?.translateTextFromJson('labels.supervisor') },
      { field: 'customer', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.customers'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.customers'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'comments', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.comments'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.comments'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },

    ];

    this.getAllOrders();
  }

  getAllOrders(): any {
    this.loadingIndicator = true;
    this.ordersService?.getOrdersList(this.page, this.perPage, this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null, this.filtersArray ? this.filtersArray : null)
      .pipe(
        map((res: any) => {
          this.ordersCount = res?.data?.pagination?.total;
          this.pagesCount = Math.ceil(this.ordersCount / this.perPage);
          let arr: any = [];
          res?.data ? res?.data.forEach((item: any) => {
            let status: any = '';
            if (item?.status == 0) {
              status = 'Pending'
            }
            if (item?.status == 1) {
              status = 'AssignedToDriver'
            }
            if (item?.status == 2) {
              status = 'DriverArrivedToCustomer'
            }
            if (item?.status == 3) {
              status = 'DriverArrivedAtStation'
            }
            if (item?.status == 3) {
              status = 'Completed'
            }
            if (item?.status == 3) {
              status = 'Cancelled'
            }
            arr.push({
              id: item?.id ? item?.id : null,
              dateTime: item?.dateTime ? new Date(item?.dateTime) : null,
              orderOrigin: item?.orderOrigin ? item?.orderOrigin : '',
              propertyType: item?.propertyType ? item?.propertyType : [],
              customerMobileNumber: item?.customerMobileNumber ? item?.customerMobileNumber : '',
              district: item?.district ? item?.district : '',
              locationLink: item?.locationLink ? item?.locationLink : '',
              tank: item?.tank ? item?.tank : [],
              status: item?.status ? status : '',
              paymentMethod: item?.paymentMethod ? item?.paymentMethod : '',
              paidAmount: item?.paidAmount ? item?.paidAmount : '0',
              cancellationCauses: item?.cancellationCauses ? item?.cancellationCauses : '',
              closedAt: item?.closedAt ? item?.closedAt : '',
              supervisors: item?.supervisors ? item?.supervisors : [],
              drivers: item?.drivers ? item?.drivers : [],
              customer: item?.customer ? item?.customer : '',
              comments: item?.comments ? item?.comments : '',

            });
          }) : '';
          this.ordersList$ = arr;
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
    let arr: any = this.ordersList$
    arr?.length == 0 ? this.getAllOrders() : '';
  }

  search(event: any): void {
    this.isLoadingSearch = true;
    this.searchKeyword = event;
    if (event?.length > 0) {
      this.isSearch = true;
    }
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getOrders();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllOrders();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.ordersCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getOrders();
  }
  filter(): void {
    const ref = this.dialogService?.open(FilterOrdersComponent, {
      header: this.publicService?.translateTextFromJson('general.filter'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.filter) {
        this.page = 1;
        this.publicService?.changePageSub?.next({ page: this.page });
        this.getOrders();
      }
    });
  }
  viewLocation(item: any): void { }

  addOrEditItem(item?: any, type?: any): void {
    type == 'edit' ? this.router.navigate(['/dashboard/addOrder', { id: item?.id }]) : this.router.navigate(['/dashboard/addOrder']);
    // const ref = this.dialogService?.open(AddEditTankComponent, {
    //   data: {
    //     item,
    //     type: type == 'edit' ? 'edit' : 'add'
    //   },
    //   header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.tanks.editTank') : this.publicService?.translateTextFromJson('dashboard.tanks.addTank'),
    //   dismissableMask: false,
    //   width: '50%',
    //   styleClass: 'custom_modal'
    // });
    // ref.onClose.subscribe((res: any) => {
    //   if (res?.listChanged) {
    //     this.page = 1;
    //     this.publicService?.changePageSub?.next({ page: this.page });
    //     this.getTanks();
    //   }
    // });
  }

  clearTable(event: any): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getOrders();
  }
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllOrders();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllOrders();
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
    this.getOrders();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
