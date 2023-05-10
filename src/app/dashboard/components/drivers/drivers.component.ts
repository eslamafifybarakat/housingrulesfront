import { finalize, map, Observable, Subscription } from 'rxjs';
import { TanksService } from './../../services/tanks.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PublicService } from './../../../shared/services/public.service';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DriversService } from '../../services/drivers.service';
import { DriverDetailsComponent } from './components/driver-details/driver-details.component';
import { AddEditDriverComponent } from './components/add-edit-driver/add-edit-driver.component';

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
    private driversService: DriversService,
    private alertsService: AlertsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      { field: 'name', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'driver_status', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.driverStatus'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.driverStatus'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
    ];

    this.getAllDrivers();
  }

  getAllDrivers(): any {
    this.loadingIndicator = true;
    this.driversService?.getDriversList(this.page, this.perPage, this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null, this.filtersArray ? this.filtersArray : null)
      .pipe(
        map((res: any) => {
          this.driversCount = res?.data?.pagination?.total;
          this.pagesCount = Math.ceil(this.driversCount / this.perPage);
          let arr: any = [];
          res?.data?.data ? res?.data?.data.forEach((tank: any) => {
            arr.push({
              id: tank?.id ? tank?.id : null,
              name: tank?.name ? tank?.name : '',
              driver_status: tank?.driver_status ? tank?.driver_status : ''
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

    let data: any = [
      { id: 1, name: 'Celine', driver_status: 'available' },
      { id: 2, name: 'nour', driver_status: 'available' },
      { id: 3, name: 'lorena', driver_status: 'available' },
      { id: 4, name: 'Ahmed', driver_status: 'available' },
      { id: 5, name: 'Ali', driver_status: 'available' },
      { id: 6, name: 'Kareem', driver_status: 'available' },
    ];
    this.driversList$ = data;
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
    this.getDrivers();
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
    this.getDrivers();
  }

  itemDetails(item?: any): void {
    const ref = this.dialogService?.open(DriverDetailsComponent, {
      data: item,
      header: this.publicService?.translateTextFromJson('dashboard.drivers.driverDetails'),
      dismissableMask: true,
      width: '50%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      // if (res?.listChanged) {
      //   this.page = 1;
      //   this.publicService?.changePageSub?.next({ page: this.page });
      //   this.getDrivers();
      // }
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
        this.getDrivers();
      }
    });
  }
  deleteItem(item: any): void {
    console.log(item);
    if (item?.confirmed) {
      let data = {
        name: item?.item?.name
      }
      this.publicService?.show_loader.next(true);
      console.log('ff');

      this.driversService?.deleteDriverId(item?.item?.id)?.subscribe(
        (res: any) => {
          if (res?.code === 200) {
            res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
            this.getAllDrivers();
            this.publicService?.show_loader?.next(false);
          } else {
            res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
            this.publicService?.show_loader?.next(false);
          }
        },
        (err) => {
          err?.message ? this.alertsService?.openSnackBar(err?.message) : '';
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
    this.getDrivers();
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
    this.getDrivers();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}

