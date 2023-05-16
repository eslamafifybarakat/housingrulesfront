import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { AlertsService } from 'src/app/core/services/alerts/alerts.service';
import { PublicService } from './../../../shared/services/public.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DialogService]
})
export class UsersComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  loadingIndicator: boolean = false;
  usersList$!: Observable<any>;
  usersCount: number = 0;
  tableHeaders: any = [];

  page: number = 1;
  perPage: number = 5;
  pagesCount: number = 0;
  rowsOptions: number[] = [5, 10, 15, 30];

  enableSortFilter: boolean = true;
  searchKeyword: any = null;
  filtersArray: any = [];
  sortObj: any = {};

  userTypesList: any = [];

  constructor(
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      {
        field: 'index', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.id'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.id'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false
        , filter: false, type: 'numeric'
      },
      // { field: 'name', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'username', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.username'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.username'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      // { field: 'email', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.email'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.email'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'userType', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.userType'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.userType'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'filterArray', dataType: 'array', list: 'userType', placeholder: this.publicService?.translateTextFromJson('placeholder.userType'), label: this.publicService?.translateTextFromJson('labels.userType') },
       { field: 'userNameStr', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.userNameStr'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.userNameStrs'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      // { field: 'mobileNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), filter: true, type: 'numeric' },
    ];

    this.getAllUsers();
    this.userTypesList = this.publicService?.getUserTypes();
  }
  getAllUsers(): any {
    this.loadingIndicator = true;
    this.usersService?.getUsersList(this.page, this.perPage, this.searchKeyword ? this.searchKeyword : null, this.sortObj ? this.sortObj : null, this.filtersArray ? this.filtersArray : null)
      .pipe(
        map((res: any) => {
          this.usersCount = res?.total;
          this.pagesCount = Math.ceil(this.usersCount / this.perPage);
          let arr: any = [];
          res?.data ? res?.data?.forEach((item: any, index: any) => {

            let userTypeArr: any = [];
            this.userTypesList?.forEach((element: any) => {
              if (element?.value == item?.userType) {
                userTypeArr?.push(element);
              }
            });

            arr.push({
              id: item?.id ? item?.id : '',
              index: index + 1,
              name: item?.name ? item?.name : '',
              username: item?.username ? item?.username : '',
              itemStatus: item?.itemStatus ? item?.itemStatus : null,
              userNameStr:  item?.userNameStr ? item?.userNameStr : '',
              userType: userTypeArr
            });
          }) : '';
          this.usersList$ = arr;
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
  getUsers(): void {
    let arr: any = this.usersList$
    arr?.length == 0 ? this.getAllUsers() : '';
  }

  search(event: any): void {
    this.isLoadingSearch = true;
    this.searchKeyword = event;
    if (event?.length > 0) {
      this.isSearch = true;
    }
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllUsers();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllUsers();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.usersCount / this.perPage);
    console.log(this.pagesCount);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });

  }
  resetPassword(item: any): void {
    const ref = this.dialogService?.open(ResetPasswordComponent, {
      data: item,
      header: this.publicService?.translateTextFromJson('form.resetPassword'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.page = 1;
        this.getAllUsers();
      }
    });
  }
  addOrEditItem(item?: any, type?: any): void {
    console.log(item);
    const ref = this.dialogService?.open(AddEditUserComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.users.editUser') : this.publicService?.translateTextFromJson('dashboard.users.addUser'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'user-modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.page = 1;
        this.getAllUsers();
      }
    });
  }
  clearTable(event: any): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllUsers();
  }
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllUsers();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllUsers();
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
    this.getAllUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
