import { AddEditTankComponent } from './components/add-edit-tank/add-edit-tank.component';
import { TankDetailsComponent } from './components/tank-details/tank-details.component';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../shared/services/public.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { TanksService } from '../../services/tanks.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-tanks',
  templateUrl: './tanks.component.html',
  styleUrls: ['./tanks.component.scss']
})
export class TanksComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  loadingIndicator: boolean = false;
  tanksList$!: Observable<any>;
  tanksCount: number = 0;
  tableHeaders: any = [];

  page: number = 1;
  perPage: number = 100000;
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
    private tanksService: TanksService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      { field: 'name', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'tankSize', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.tankSize'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.tankSize'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'palateNo', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.palateNo'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.palateNo'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'isWorking', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.isWorking'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.isWorking'), filter: true, type: 'status', list: 'isWorking', placeholder: this.publicService?.translateTextFromJson('placeholder.isWorking'), label: this.publicService?.translateTextFromJson('labels.isWorking') },
      { field: 'isAvailable', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), filter: true, type: 'boolean' },
    ];

    this.getAllTanks();
  }

  getAllTanks(): any {
    this.loadingIndicator = true;
    this.tanksService?.getTanksList(this.page, this.perPage, this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null, this.filtersArray ? this.filtersArray : null)
      .pipe(
        map((res: any) => {
          this.tanksCount = res?.total;
          this.pagesCount = Math.ceil(this.tanksCount / this.perPage);
          let arr: any = [];

          let workingItems: any = [];
          workingItems = this.publicService?.getIsWorking();
          res?.data ? res?.data?.forEach((tank: any) => {
            let isWorking: any = '';
            if (tank?.isWorking == true) {
              isWorking = workingItems[1]?.name;
            } else {
              isWorking = workingItems[0]?.name;
            }
            let sizeTank: any;
            if (tank?.tankSize == 0) {
              sizeTank = "Size13";
            }
            if (tank?.tankSize == 1) {
              sizeTank = "Size20";
            }
            if (tank?.tankSize == 2) {
              sizeTank = "Size32";
            }

            arr.push({
              id: tank?.id ? tank?.id : null,
              name: tank?.name ? tank?.name : '',
              tankSize: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.'+sizeTank),
              palateNo: tank?.palateNo ? tank?.palateNo : '',
              isWorking: isWorking,
              isAvailable: tank?.isAvailable ? true : false
            });
          }) : '';
          console.log(arr);
          this.tanksList$ = arr;

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
  getTanks(): void {
    let arr: any = this.tanksList$
    arr?.length == 0 ? this.getAllTanks() : '';
  }

  search(event: any): void {
    this.isLoadingSearch = true;
    this.searchKeyword = event;
    if (event?.length > 0) {
      this.isSearch = true;
    }
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getTanks();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllTanks();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.tanksCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getTanks();
  }
  toggleStatus(event: any): void {
    this.tanksService?.tankToggleStatus(event?.id)?.subscribe(res => {
      if (res?.code == 200) {
        this.getAllTanks();
        this.cdr.detectChanges();
      } else {
        res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
      }
    },
      (err) => {
        err?.message ? this.alertsService?.openSnackBar(err?.message) : '';
      });
  }
  itemDetails(item?: any): void {
    const ref = this.dialogService?.open(TankDetailsComponent, {
      data: item,
      header: this.publicService?.translateTextFromJson('dashboard.tanks.tankDetails'),
      dismissableMask: true,
      width: '40%',
      styleClass: 'custom_modal'
    });
  }
  addOrEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditTankComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.tanks.editTank') : this.publicService?.translateTextFromJson('dashboard.tanks.addTank'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.page = 1;
        this.publicService?.changePageSub?.next({ page: this.page });
        this.getTanks();
      }
    });
  }
  deleteItem(item: any): void {
    if (item?.confirmed) {
      this.publicService?.show_loader.next(true);
      this.tanksService?.deleteTankId(item?.item?.id)?.subscribe(
        (res: any) => {
          if (res?.code === 200) {
            res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
            this.getAllTanks();
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
    this.getTanks();
  }
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllTanks();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllTanks();
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
    this.getAllTanks();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
