import { Observable, Subscription } from 'rxjs';
import { PublicService } from './../../../shared/services/public.service';
import { Component, OnInit } from '@angular/core';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
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

  constructor(
    private publicService: PublicService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.tableHeaders = [
      {
        field: 'emo_number', header: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.id'), title: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.id'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false
        , filter: true, type: 'numeric'
      },
      { field: 'full_name', header: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.name'), title: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.name'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'email', header: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.email'), title: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.email'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'banks', header: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.banks'), title: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.banks'), sort: false, filter: true, type: 'filterArray', dataType: 'array', list: 'banks', placeholder: this.publicService?.translateTextFromJson('placeholder.chooseBank'), label: this.publicService?.translateTextFromJson('labels.bank') },

      { field: 'is_active', header: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.status'), title: this.publicService?.translateTextFromJson('dashboard.usersList.tableHeader.status'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'boolean' },
    ];
    this.getAllUsers();
  }
  getAllUsers(Keyword?: any): any {
    this.usersCount = 20;
    let data: any = [];
    data = [
      { emo_number: 1, full_name: 'Ahmed mohamed', email: 'Ahmed33@gmail.com', banks: [{ id: 2, name: 'bank1' }, { id: 3, name: 'bank2' }], is_active: true },
      { emo_number: 1, full_name: 'Ali mohamed', email: 'Ali533@gmail.com', banks: [{ id: 2, name: 'bank1' }, { id: 3, name: 'bank2' }, { id: 3, name: 'bank3' }], is_active: false },
      { emo_number: 1, full_name: 'Marwan mohamed', email: 'Ahmed33@gmail.com', banks: [{ id: 2, name: 'bank1' }, { id: 3, name: 'bank2' }], is_active: false },
      { emo_number: 1, full_name: 'celine mohamed', email: 'celine33@gmail.com', banks: [{ id: 2, name: 'bank1' }, { id: 3, name: 'bank2' }], is_active: false },
      { emo_number: 1, full_name: 'nour mohamed', email: 'Ahmed33@gmail.com', banks: [{ id: 2, name: 'bank1' }, { id: 3, name: 'bank2' }], is_active: true },
      { emo_number: 1, full_name: 'Ahmed mohamed', email: 'Ahmed33@gmail.com', banks: [{ id: 2, name: 'bank1' }, { id: 3, name: 'bank2' }], is_active: true }
    ]
    this.usersList$ = data

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
    this.getUsers();
  }
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllUsers(this.searchKeyword);
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.usersCount / this.perPage);
    // this.getAllUsers();
    console.log(this.pagesCount);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });

  }
  toggleStatus(event: any): void {

  }
  addOrEditItem(item?: any, type?: any): void {
    console.log(item);
    const ref = this.dialogService?.open(AddEditUserComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.usersList.editUser') : this.publicService?.translateTextFromJson('dashboard.usersList.addUser'),
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
    this.getUsers();
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
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
