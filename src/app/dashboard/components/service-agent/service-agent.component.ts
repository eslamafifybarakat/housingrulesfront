import { AddEditServiceAgentComponent } from './components/add-edit-service-agent/add-edit-service-agent.component';
import { ServiceAgentDetailsComponent } from './components/service-agent-details/service-agent-details.component';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { ServiceAgentService } from '../../services/service-agent.service';
import { PublicService } from './../../../shared/services/public.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-service-agent',
  templateUrl: './service-agent.component.html',
  styleUrls: ['./service-agent.component.scss']
})
export class ServiceAgentComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  loadingIndicator: boolean = false;
  serviceAgentList$!: Observable<any>;
  serviceAgentCount: number = 0;
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
    private serviceAgentService: ServiceAgentService,
    private alertsService: AlertsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      { field: 'arName', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'mobileNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'isWorking', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.isWorking'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.isWorking'), filter: true, type: 'boolean' },
    ];

    this.getAllServiceAgents();
  }

  getAllServiceAgents(): any {
    this.loadingIndicator = true;
    this.serviceAgentService?.getServiceAgentsList(this.page, this.perPage, this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null, this.filtersArray ? this.filtersArray : null)
      .pipe(
        map((res: any) => {
          this.serviceAgentCount = res?.total;
          this.pagesCount = Math.ceil(this.serviceAgentCount / this.perPage);
          let arr: any = [];
          res?.data ? res?.data?.forEach((item: any) => {
            arr.push({
              id: item?.id ? item?.id : null,
              arName: item?.arName ? item?.arName : '',
              enName: item?.enName ? item?.enName : '',
              mobileNumber: item?.mobileNumber ? item?.mobileNumber : '',
              isWorking: item?.isWorking ? true : false
            });
          }) : '';
          this.serviceAgentList$ = arr;

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
  getServiceAgents(): void {
    let arr: any = this.serviceAgentList$;
    arr?.length == 0 ? this.getAllServiceAgents() : '';
  }

  search(event: any): void {
    this.isLoadingSearch = true;
    this.searchKeyword = event;
    if (event?.length > 0) {
      this.isSearch = true;
    }
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllServiceAgents();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllServiceAgents();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.serviceAgentCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getServiceAgents();
  }
  toggleStatus(event: any): void {
    this.serviceAgentService?.servicesAgentToggleStatus(event?.id)?.subscribe(res => {
      if (res?.code == 200) {
        this.getAllServiceAgents();
        res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
        this.cdr.detectChanges();
      } else {
        res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
      }
    },
      (err) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
      });
  }
  itemDetails(item?: any): void {
    const ref = this.dialogService?.open(ServiceAgentDetailsComponent, {
      data: item,
      header: this.publicService?.translateTextFromJson('dashboard.serviceAgent.ServiceAgentDetails'),
      dismissableMask: true,
      width: '40%',
      styleClass: 'custom_modal'
    });
  }
  addOrEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditServiceAgentComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.serviceAgent.editServiceAgent') : this.publicService?.translateTextFromJson('dashboard.serviceAgent.adddServiceAgent'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.page = 1;
        this.publicService?.changePageSub?.next({ page: this.page });
        this.getAllServiceAgents();
      }
    });
  }
  deleteItem(item: any): void {
    if (item?.confirmed) {
      this.publicService?.show_loader.next(true);
      this.serviceAgentService?.deleteServiceAgentId(item?.item?.id)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true && res?.statusCode == 200) {
            res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
            this.getAllServiceAgents();
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

  clearTable(event: any): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllServiceAgents();
  }
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllServiceAgents();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllServiceAgents();
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
    this.getAllServiceAgents();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
