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
  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      { field: 'order_number', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderNumber'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderNumber'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'request_origin', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.requestOrigin'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.requestOrigin'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'entity_type', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.entityType'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.entityType'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'customer_name', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerName'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerName'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'customer_number', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerNumber'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.customerNumber'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'numeric' },
      { field: 'website_link', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.websiteLink'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.websiteLink'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', enableItemLink: true },
      { field: 'supervisor', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisor'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisor'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'driver', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.driver'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.driver'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'order_status', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderStatus'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderStatus'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },

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
          res?.data?.data ? res?.data?.data.forEach((tank: any) => {
            arr.push({
              id: tank?.id ? tank?.id : null,

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

    let data: any = [
      { id: 1, order_number: '765-776-7', request_origin: 'By TMS	', entity_type: 'Governmental', customer_name: 'Marwan ali', customer_number: 877, website_link: '	Location Link', supervisor: 'Ahmed', driver: 'Mohamed', order_status: '	Driver Arrived To Customer	' },
      { id: 2, order_number: '695-776-7', request_origin: 'By TMS	', entity_type: 'Governmental', customer_name: 'Ali ali', customer_number: 877, website_link: '	Location Link', supervisor: 'Ahmed', driver: 'Mohamed', order_status: '	Driver Arrived To Customer	' },
      { id: 3, order_number: '985-776-7', request_origin: 'By TMS	', entity_type: 'Governmental', customer_name: 'Celine ahmed', customer_number: 877, website_link: '	Location Link', supervisor: 'Ahmed', driver: 'Mohamed', order_status: '	Driver Arrived To Customer	' },
      { id: 1, order_number: '555-776-7', request_origin: 'By TMS	', entity_type: 'Governmental', customer_name: 'Marwan ali', customer_number: 877, website_link: '	Location Link', supervisor: 'Ahmed', driver: 'Mohamed', order_status: '	Driver Arrived To Customer	' }
    ];
    this.ordersList$ = data;
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
