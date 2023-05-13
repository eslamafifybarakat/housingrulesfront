
import { AddEditSupervisorComponent } from './components/add-edit-supervisor/add-edit-supervisor.component';
import { SupervisorDetailsComponent } from './components/supervisor-details/supervisor-details.component';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../shared/services/public.service';
import { SupervisorsService } from '../../services/supervisors.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-supervisors',
  templateUrl: './supervisors.component.html',
  styleUrls: ['./supervisors.component.scss']
})
export class SupervisorsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  loadingIndicator: boolean = false;
  supervisorsList$!: Observable<any>;
  supervisorsCount: number = 0;
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
    private supervisorsService: SupervisorsService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      { field: 'arName', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'district', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.district'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.district'), filter: true, type: 'filterArray', dataType: 'array', list: 'districts', placeholder: this.publicService?.translateTextFromJson('placeholder.district'), label: this.publicService?.translateTextFromJson('labels.district') },
      { field: 'status', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), filter: true, type: 'filterArray', dataType: 'array', list: 'isWorking', placeholder: this.publicService?.translateTextFromJson('placeholder.isWorking'), label: this.publicService?.translateTextFromJson('labels.isWorking'), status: true },
      // { field: 'is_active', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), filter: true, type: 'boolean' },
    ];

    this.getAllSupervisors();
  }

  getAllSupervisors(): any {
    this.loadingIndicator = true;
    this.supervisorsService?.getSupervisorsList(this.page, this.perPage, this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null, this.filtersArray ? this.filtersArray : null)
      .pipe(
        map((res: any) => {
          this.supervisorsCount = res?.total;
          this.pagesCount = Math.ceil(this.supervisorsCount / this.perPage);
          let arr: any = [];
          let workingItems: any = [];
          workingItems = this.publicService?.getIsWorking();
          let districtsItems: any = [];
          res?.data ? res?.data.forEach((item: any) => {
            let isWorking: any = '';
            if (item?.isWorking == true) {
              isWorking = workingItems[1]?.name;
            } else {
              isWorking = workingItems[0]?.name;
            }

            // item?.districts?.forEach((item: any) => {
            //   districtsItems?.push({ name: item?.name });
            // });

            arr.push({
              id: item?.id ? item?.id : null,
              arName: item?.arName ? item?.arName : '',
              enName: item?.enName ? item?.enName : '',
              districtsVal: item?.districtIds ? item?.districtIds : [],
              district: districtsItems,
              isWorkingVal: item?.isWorking,
              status: isWorking
            });
          }) : '';
          this.supervisorsList$ = arr;
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
  getSupervisors(): void {
    let arr: any = this.supervisorsList$
    arr?.length == 0 ? this.getAllSupervisors() : '';
  }

  search(event: any): void {
    this.isLoadingSearch = true;
    this.searchKeyword = event;
    if (event?.length > 0) {
      this.isSearch = true;
    }
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllSupervisors();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllSupervisors();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.supervisorsCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    // this.getSupervisors();
  }
  toggleStatus(event: any): void {
    this.supervisorsService?.supervisorToggleStatus(event?.id)?.subscribe(res => {
      if (res?.statusCode == 200 && res?.isSuccess == true) {
        this.getAllSupervisors();
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
    const ref = this.dialogService?.open(SupervisorDetailsComponent, {
      data: item,
      header: this.publicService?.translateTextFromJson('dashboard.supervisors.supervisorDetails'),
      dismissableMask: true,
      width: '40%',
      styleClass: 'custom_modal'
    });
  }
  addOrEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditSupervisorComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.supervisors.editSupervisor') : this.publicService?.translateTextFromJson('dashboard.supervisors.addSupervisor'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.page = 1;
        this.publicService?.changePageSub?.next({ page: this.page });
        this.getAllSupervisors();
      }
    });
  }
  deleteItem(item: any): void {
    console.log(item);
    if (item?.confirmed) {
      this.publicService?.show_loader.next(true);
      this.supervisorsService?.deleteSupervisorId(item?.item?.id)?.subscribe(
        (res: any) => {
          if (res?.statusCode == 200 && res?.isSuccess == true) {
            res?.message ? this.alertsService?.openSnackBar(res?.message) : '';
            this.getAllSupervisors();
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
    this.getAllSupervisors();
  }
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllSupervisors();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllSupervisors();
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
    this.getAllSupervisors();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
