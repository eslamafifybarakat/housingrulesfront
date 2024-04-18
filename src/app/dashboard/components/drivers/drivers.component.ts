import { AddEditDriverComponent } from './components/add-edit-driver/add-edit-driver.component';
import { DriverDetailsComponent } from './components/driver-details/driver-details.component';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../shared/services/public.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DriversService } from '../../services/drivers.service';
import { finalize, map, Observable, Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  loadingIndicator: boolean = false;
  driversList$!: Observable<any>;
  driversCount: number = 0;
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

  driverStatusList: any = [];

  constructor(
    private driversService: DriversService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      { field: 'arName', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },

      { field: 'tank', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.tanks'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.tanks'), filter: true, type: 'text',   placeholder: this.publicService?.translateTextFromJson('placeholder.tank'), label: this.publicService?.translateTextFromJson('labels.tank') },
      { field: 'supervisor', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisors'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.supervisors'), filter: false, type: 'filterArray', dataType: 'array', list: 'supervisors', placeholder: this.publicService?.translateTextFromJson('placeholder.supervisor'), label: this.publicService?.translateTextFromJson('labels.supervisor') },
      { field: 'mobileNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), filter: true, type: 'text' },

      { field: 'driverStatus', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.driverStatus'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.driverStatus'), filter: false, type: 'filterArray', dataType: 'array', list: 'driverStatus', placeholder: this.publicService?.translateTextFromJson('placeholder.driverStatus'), label: this.publicService?.translateTextFromJson('labels.driverStatus'), status: true },
    ];

    this.getAllDrivers();
    this.driverStatusList = this.publicService?.getDriverStatus();

  }

  getAllDrivers(): any {
    this.loadingIndicator = true;
    this.driversService?.getDriversList(this.page, this.perPage, this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null, this.filtersArray ? this.filtersArray : null)
      .pipe(
        map((res: any) => {
          this.driversCount = res?.total;
          this.pagesCount = Math.ceil(this.driversCount / this.perPage);
          let arr: any = [];
          res?.data ? res?.data?.forEach((driver: any) => {
            let tankArr: any = [];
            driver?.tank ? tankArr?.push({ name: driver?.tank }) : '';
            let supervisorArr: any = [];
            driver?.supervisor ? supervisorArr?.push({ name: driver?.supervisor }) : '';
            let driverStatus: any = '';
            let statusClass: any = '';
            if (driver?.driverStatus == 0) {
              driverStatus = this.driverStatusList[0].name;
              statusClass = this.driverStatusList[0].class;
            }
            if (driver?.driverStatus == 1) {
              driverStatus = this.driverStatusList[1].name;
              statusClass = this.driverStatusList[1].class;
            }
            if (driver?.driverStatus == 2) {
              driverStatus = this.driverStatusList[2].name;
              statusClass = this.driverStatusList[2].class;
            }
            arr.push({
              id: driver?.id ? driver?.id : null,
              arName: driver?.arName ? driver?.arName : '',
              enName: driver?.enName ? driver?.enName : '',
              driverStatus: driverStatus,
              statusVal: driver?.driverStatus,
              statusClass: statusClass,
              tankId: driver?.tankId,
              supervisorId: driver?.supervisorId,
              mobileNumber: driver?.mobileNumber ? driver?.mobileNumber : '',
              tank:  driver?.tank,
              supervisor: supervisorArr,
              isAllowtoCreateOrder: driver?.isAllowtoCreateOrder
            });
          }) : '';
          this.driversList$ = arr;
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

    // let data: any = [
    //   { id: 1, name: 'Celine', driver_status: 'available', mobile_phone: '65667898', tanks: [{ name: 'mohamed' }], supervisors: [{ name: 'nour' }, { name: 'kareem' }] },
    //   { id: 2, name: 'nour', driver_status: 'available', mobile_phone: '65667898', tanks: [{ name: 'mohamed' }], supervisors: [{ name: 'nour' }, { name: 'kareem' }] },
    //   { id: 3, name: 'lorena', driver_status: 'busy', mobile_phone: '65667898', tanks: [{ name: 'mohamed' }], supervisors: [{ name: 'nour' }, { name: 'kareem' }] },
    //   { id: 4, name: 'Ahmed', driver_status: 'available', mobile_phone: '65667898', tanks: [{ name: 'mohamed' }], supervisors: [{ name: 'nour' }, { name: 'kareem' }] },
    //   { id: 5, name: 'Ali', driver_status: 'busy', mobile_phone: '65667898', tanks: [{ name: 'mohamed' }], supervisors: [{ name: 'nour' }, { name: 'kareem' }] },
    //   { id: 6, name: 'Kareem', driver_status: 'far', mobile_phone: '65667898', tanks: [{ name: 'mohamed' }], supervisors: [{ name: 'nour' }, { name: 'kareem' }] },
    // ];
    // this.driversList$ = data;
  }
  getDrivers(): void {
    let arr: any = this.driversList$
    arr?.length == 0 ? this.getAllDrivers() : '';
  }

  search(event: any): void {
    this.isLoadingSearch = true;
    this.searchKeyword = event;
    if (event?.length > 0) {
      this.isSearch = true;
    }
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllDrivers();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllDrivers();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.driversCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    // this.getDrivers();
  }

  itemDetails(item?: any): void {
    const ref = this.dialogService?.open(DriverDetailsComponent, {
      data: item,
      header: this.publicService?.translateTextFromJson('dashboard.drivers.driverDetails'),
      dismissableMask: true,
      width: '40%',
      styleClass: 'custom_modal'
    });
  }
  addOrEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditDriverComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.drivers.editDriver') : this.publicService?.translateTextFromJson('dashboard.drivers.addDriver'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.page = 1;
        this.publicService?.changePageSub?.next({ page: this.page });
        this.getAllDrivers();
      }
    });
  }
  deleteItem(item: any): void {
    if (item?.confirmed) {
      this.publicService?.show_loader.next(true);
      this.driversService?.deleteDriverId(item?.item?.id)?.subscribe(
        (res: any) => {
          if (res?.statusCode == 200 && res?.isSuccess == true) {
            res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
            this.getAllDrivers();
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
    this.cdr.detectChanges();
  }

  clearTable(event: any): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllDrivers();
  }
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllDrivers();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllDrivers();
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
    this.getAllDrivers();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}

