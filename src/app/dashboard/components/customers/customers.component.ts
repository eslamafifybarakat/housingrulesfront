
import { AddEditCustomerComponent } from './components/add-edit-customer/add-edit-customer.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../shared/services/public.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { TanksService } from '../../services/tanks.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SetOrderScheduleForCustomerModalComponent } from './components/set-order-schedule-for-customer-modal/set-order-schedule-for-customer-modal.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  loadingIndicator: boolean = false;
  customersList$!: Observable<any>;
  customersCount: number = 0;
  tableHeaders: any = [];

  page: number = 1;
  perPage: number = 30;
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
    private customersService: CustomersService,
    private alertsService: AlertsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private tanksService: TanksService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      { field: 'name', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'address', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.address'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.address'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'location', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.location'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.location'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', },
      // { field: 'locationLink', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', enableItemLink: true, typeViewModal: 'location' },
      { field: 'mobileNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), filter: true, type: 'text' },
    ];

    this.getAllCustomers();
  }

  getAllCustomers(): any {
    this.loadingIndicator = true;
    this.customersService?.getCustomersList(this.page, this.perPage, this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null, this.filtersArray ? this.filtersArray : null)
      .pipe(
        map((res: any) => {
          this.customersCount = res?.total;
          this.pagesCount = Math.ceil(this.customersCount / this.perPage);
          let arr: any = [];
          res?.data ? res?.data?.forEach((item: any) => {
            arr.push({
              id: item?.id ? item?.id : null,
              name: item?.name ? item?.name : '',
              address: item?.address ? item?.address : '',
              location: item?.location ? item?.location : '',
              locationLink: item?.locationLink ? item?.locationLink : null,
              mobileNumber: item?.mobileNumber ? item?.mobileNumber : '',
              isVip: item?.isVip ? item?.isVip : false
            });
          }) : '';
          this.customersList$ = arr;

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
  getCustomers(): void {
    let arr: any = this.customersList$;
    arr?.length == 0 ? this.getAllCustomers() : '';
  }

  search(event: any): void {
    this.isLoadingSearch = true;
    this.searchKeyword = event;
    if (event?.length > 0) {
      this.isSearch = true;
    }
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllCustomers();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    //  this.getAllCustomers();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.customersCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
  }

  itemDetails(item?: any): void {
    const ref = this.dialogService?.open(CustomerDetailsComponent, {
      data: item,
      header: this.publicService?.translateTextFromJson('dashboard.customers.customerDetails'),
      dismissableMask: true,
      width: '40%',
      styleClass: 'custom_modal'
    });
  }
  addOrEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditCustomerComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.customers.editCustomer') : this.publicService?.translateTextFromJson('dashboard.customers.addCustomer'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.page = 1;
        this.publicService?.changePageSub?.next({ page: this.page });
        this.getAllCustomers();
      }
    });
  }
  deleteItem(item: any): void {
    if (item?.confirmed) {
      this.publicService?.show_loader.next(true);
      this.customersService?.deleteCustomerId(item?.item?.id)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true && res?.statusCode == 200) {
            res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
            this.getAllCustomers();
            this.publicService?.show_loader?.next(false);
          } else {
            res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
            this.publicService?.show_loader?.next(false);
          }
        },
        (err) => {
          err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
          this.publicService?.show_loader?.next(false);
        });
    }
    this.cdr?.detectChanges();
  }
  VIPCustomerAction(item: any): void {
    const ref = this.dialogService?.open(SetOrderScheduleForCustomerModalComponent, {
      data: {
        item
      },
      header: this.publicService?.translateTextFromJson('labels.isVip'),
      dismissableMask: false,
      width: '65%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        // this.page = 1;
        // this.publicService?.changePageSub?.next({ page: this.page });
        // this.getAllCustomers();
      }
    });
  }

  clearTable(event: any): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllCustomers();
  }
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllCustomers();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllCustomers();
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
    this.getAllCustomers();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}

