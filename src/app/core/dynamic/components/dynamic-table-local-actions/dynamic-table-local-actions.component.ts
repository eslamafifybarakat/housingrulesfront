import { keys } from 'src/app/shared/configs/localstorage-key';
import { OrdersService } from './../../../../dashboard/services/orders.service';
import { ConfirmDeleteComponent } from './../../../../shared/components/confirm-delete/confirm-delete.component';
import { SupervisorsService } from 'src/app/dashboard/services/supervisors.service';
import { DriversService } from './../../../../dashboard/services/drivers.service';
import { TanksService } from './../../../../dashboard/services/tanks.service';
import { PublicService } from './../../../../shared/services/public.service';
// import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Paginator } from 'primeng/paginator';
@Component({
  selector: 'app-dynamic-table-local-actions',
  templateUrl: './dynamic-table-local-actions.component.html',
  styleUrls: ['./dynamic-table-local-actions.component.scss']
})
export class DynamicTableLocalActionsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  @ViewChild('paginator') paginator: Paginator | undefined;

  @Input() showSearch: boolean = false;
  @Input() isLoadingSearch: boolean = false;

  @Input() showClear: boolean = false;
  @Input() enableDeleteButton: boolean = false;
  @Input() enableAssignToButton: boolean = false;
  @Input() enableArticleNoteStatusButton: boolean = false;

  @Input() isLoading: boolean = false;
  @Input() tableHeaders: any = [];
  @Input() tableData: any = [];
  @Input() totalItems: number = 0;
  @Input() pageActiveNumber: number = 0;

  @Input() showSelection: boolean = false;

  @Input() showArrangement: boolean = false;

  @Input() countries: any = [];
  @Input() statuses: any = [];

  @Input() enableDateFormate: boolean = false;
  @Input() dateFormateString: string = 'EE | dd/MM/YYYY | hh:mm a';

  @Input() showReport: boolean = false;
  @Input() showCopy: boolean = false;

  @Input() showActions: boolean = false;
  @Input() showDetails: boolean = false;
  @Input() showDelete: boolean = false;
  @Input() showEdit: boolean = false;
  @Input() showCopyAction: boolean = false;
  @Input() showResetPassword: boolean = false;

  @Input() showPaginationText: boolean = false;
  @Input() pageNumber: number = 1;
  @Input() pages: number = 0;
  @Input() results: number = 0;
  @Input() paginatorRows: number = 0;
  @Input() rowsPerPageOptions: number[] = [2, 4, 10];

  @Input() enableConfirmDeleteDialog: boolean = false;
  @Input() keyDelete: string = '';
  @Input() enableConfirmedByShowInput: boolean = false;

  @Input() notFoundImage: string = 'assets/image/not-found/no-data.svg';
  @Input() notFoundText: string = this.publicService?.translateTextFromJson("general.no_records_found");

  @Input() isSearch: boolean = false;

  @Input() arrayChildKey: string = '';

  @Input() enableReport: boolean = false;

  @Input() enableAddNewQuestion: boolean = false;

  @Input() rowExpand: boolean = false;
  @Input() itemExpandKey: string = '';

  @Input() tableChildHeaders: any = [];
  @Input() showChildHeader: boolean = false;

  @Input() notesSelectedItems: boolean = false;
  @Input() showDefaultSelect: boolean = false;


  @Input() enableFilterDriverStatus: boolean = false;
  @Input() enableFilterOrderStatus: boolean = false;
  @Input() enableFilterIsWorking: boolean = false;
  @Input() enablefilterDistricts: boolean = false;
  @Input() enableFilterPropertyType: boolean = false;
  @Input() enableFilterUserType: boolean = false;

  @Input() enableFilterSupervisors: boolean = false;
  @Input() enableFilterTanks: boolean = false;
  @Input() enableFilterDrivers: boolean = false;

  // send flag to the parent componenet to open dialogs and send data
  @Output() searchHandler: EventEmitter<any> = new EventEmitter();

  @Output() clearHandler: EventEmitter<any> = new EventEmitter();
  @Output() deleteSelectedItemsHandlerEmit: EventEmitter<any> = new EventEmitter();

  @Output() selectionHandler: EventEmitter<any> = new EventEmitter();

  @Output() arrangeHandler: EventEmitter<any> = new EventEmitter();

  @Output() customSortHandler: EventEmitter<any> = new EventEmitter();
  @Output() filterHandler: EventEmitter<any> = new EventEmitter();

  @Output() toggleStatusHandler: EventEmitter<any> = new EventEmitter();

  @Output() detailsHandler: EventEmitter<any> = new EventEmitter();
  @Output() editHandler: EventEmitter<any> = new EventEmitter();
  @Output() copyActionHandler: EventEmitter<any> = new EventEmitter();
  @Output() deleteHandler: EventEmitter<any> = new EventEmitter();

  @Output() paginateHandler: EventEmitter<any> = new EventEmitter();
  @Output() paginateOptionsHandler: EventEmitter<any> = new EventEmitter();

  @Output() banksHandler: EventEmitter<any> = new EventEmitter();

  @Output() reportHandler: EventEmitter<any> = new EventEmitter();
  @Output() copyHandler: EventEmitter<any> = new EventEmitter();
  @Output() colEventHandler: EventEmitter<any> = new EventEmitter();

  @Output() editChildHandler: EventEmitter<any> = new EventEmitter();
  @Output() copyChildHandler: EventEmitter<any> = new EventEmitter();
  @Output() resetPasswordHandler: EventEmitter<any> = new EventEmitter();

  @Output() itemActionHandler: EventEmitter<any> = new EventEmitter();
  @Output() itemAssignUserHandler: EventEmitter<any> = new EventEmitter();
  @Output() itemChangeStatusHandler: EventEmitter<any> = new EventEmitter();

  @ViewChild('dropdown') dropdown: any;
  @ViewChild('dt1') dt: any;
  @ViewChild('search') search: any;

  tableDataCount: number = 0;
  selectedItems: any;
  selectedItemsCount: number = 0;
  isClear: boolean = false;
  isFilter: boolean = false;
  paginateOption: any = null;

  driverStatusList: any = [];
  orderStatusList: any = [];
  supervisorsList: any = [];
  tanksList: any = [];
  driversList: any = [];
  isWorkingList: any = [];
  districtsList: any = [];
  propertyTypeList: any = [];
  userTypeList: any = [];

  assignedUsers: any = [];
  newAssignedUsers: any = [];
  articleStatusList: any = [];
  requestSourceList: any = [];
  groupsList: any = [];
  rolesList: any = [];
  productsList: any = [];
  sectionsList: any = [];
  examStatusList: any = [];
  contentArticlesNotesTypes: any = [];
  articlesNotesTypes: any = [];
  parentSkillsList: any = [];
  questionTypesList: any = [];

  skeletonItems: any;

  countSelected: number = 0;
  selectedElements: any = [];
  selectAll: boolean = false;
  date: Date = new Date();
  searchItems: any = [];
  _selectedColumns: any[] = [];


  filtersTable: any = [];
  collapse: boolean = false;
  operator: any = { name: this.publicService?.translateTextFromJson('primeng.timeIs'), operator: 'timeIs' };
  timeValue: any;

  collapseEnd: boolean = false;
  operatorEnd: any = { name: this.publicService?.translateTextFromJson('primeng.timeIs'), operator: 'timeIs' };
  timeValueEnd: any;

  timeList: any = [
    { name: this.publicService?.translateTextFromJson('primeng.timeIs'), operator: 'timeIs' },
    { name: this.publicService?.translateTextFromJson('primeng.timeIsNot'), operator: 'timeIsNot' },
    { name: this.publicService?.translateTextFromJson('primeng.timeBefore'), operator: 'timeBefore' },
    { name: this.publicService?.translateTextFromJson('primeng.timeAfter'), operator: 'timeAfter' },
  ];

  newQuestionList: any = [
    { name: this.publicService?.translateTextFromJson('dashboard.usersList.SetSetOfQuestions') },
    { name: this.publicService?.translateTextFromJson('dashboard.usersList.CreateSetOfQuestions') },
    { name: this.publicService?.translateTextFromJson('dashboard.usersList.CreateNewQuestion') }
  ]
  url: any;
  collapseAssignMenu: boolean = false;

  currLang: any = '';

  constructor(
    private supervisorsService: SupervisorsService,
    private driversService: DriversService,
    private dialogService: DialogService,
    private publicService: PublicService,
    private alertsService: AlertsService,
    private orderService: OrdersService,
    private tanksService: TanksService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currLang = window.localStorage.getItem(keys?.language);
    // this.publicService?.changePageSub?.subscribe((res: any) => {
    //   if (res?.page) {
    //     this.changePageActiveNumber(res?.page);
    //   }
    // });
    this.url = this.router?.url;

    this.skeletonItems = [0, 1, 2, 3, 4, 5];
    this.showReport == true ? this.skeletonItems?.push({ action: true }, { report: true }) : this.skeletonItems?.push({ action: true })

    this._selectedColumns = this.tableHeaders;
    this.tableHeaders?.forEach((item: any) => {
      // if (item?.sort) {
      this.searchItems?.push(item?.field);
      // }
      console.log(this.searchItems);

    });
    if (this.enableFilterDriverStatus == true) {
      this.getDriverStatus();
    }
    if (this.enableFilterOrderStatus == true) {
      this.getOrderStatus();
    }
    if (this.enableFilterIsWorking == true) {
      this.getIsWorking();
    }
    if (this.enablefilterDistricts == true) {
      this.getDistricts();
    }
    if (this.enableFilterSupervisors == true) {
      this.getAllSupervisors();
    }
    if (this.enableFilterTanks == true) {
      this.getAllTanks();
    }
    if (this.enableFilterDrivers == true) {
      this.getAllDrivers();
    }
    if (this.enableFilterPropertyType == true) {
      this.getPropertyType();
    }
    if (this.enableFilterUserType == true) {
      this.getUserTypes();
    }
  }

  searchHandlerEmit(event: any): void {
    this.searchHandler.emit(event)
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.tableHeaders.filter((col: any) => val.includes(col));
  }

  clearSearchValue(search: any): void {
    search.value = '';
    // this.searchHandler.emit('');
  }
  selectionHandlerEmit(): void {
    this.tableData.filter((val: any) => !this.selectedItems.includes(val));
    this.selectionHandler.emit(this.selectedItems);
    console.log(this.selectedItems);
  }
  deleteSelectedItems(): void {
    // const ref = this.dialogService.open(ConfirmDeleteComponent, {
    //   data: {
    //     selectedItem: true,
    //     enableConfirm: false,
    //   },
    //   header: this.publicService?.translateTextFromJson('general.confirm_delete'),
    //   dismissableMask: false,
    //   width: '35%',
    // });

    // ref.onClose.subscribe((res: any) => {
    //   if (res?.confirmed) {
    //     this.tableData.filter((val: any) => !this.selectedItems.includes(val));
    //     this.deleteSelectedItemsHandlerEmit?.emit(this.selectedItems);
    //     this.selectedItems = null;
    //   }
    // });

  }

  arrangeItems(item: any): void {
    this.arrangeHandler?.emit(item);
  }

  statusHandlerEmit(item: any): void {
    this.toggleStatusHandler?.emit(item)
  }
  detailsHandlerEmit(item: any): void {
    this.detailsHandler.emit(item);
  }
  reportHandlerEmit(item: any): void {
    this.reportHandler.emit({ item: item });
  }
  copyHandlerEmit(item: any): void {
    this.copyHandler.emit({ item: item });
  }
  colEventHandlerEmit(item: any, type?: string): void {
    this.colEventHandler.emit({ item: item, type: type });
    console.log();

  }
  editHandlerEmit(item: any): void {
    this.editHandler.emit(item);
  }
  copyActionHandlerEmit(item: any): void {
    this.copyActionHandler.emit(item);
  }

  editChildHandlerEmit(item: any): void {
    this.editChildHandler.emit(item);
  }
  copyChildHandlerEmit(item: any): void {
    this.copyChildHandler.emit(item);
  }
  resetPasswordHandlerEmit(item: any): void {
    this.resetPasswordHandler.emit(item);
  }
  deleteHandlerEmit(item: any): void {
    if (this.enableConfirmDeleteDialog) {
      const ref = this.dialogService.open(ConfirmDeleteComponent, {
        data: {
          name: item[this.keyDelete],
          enableConfirm: this.enableConfirmedByShowInput,
        },
        header: this.publicService?.translateTextFromJson('general.confirm_delete'),
        dismissableMask: false,
        width: '35%'
      });

      ref.onClose.subscribe((res: any) => {
        if (res?.confirmed) {
          this.deleteHandler?.emit({ item: item, confirmed: res?.confirmed });
        }
      });
    } else {
      this.deleteHandler?.emit({ item: item, confirmed: true });
    }
  }
  paginate(event?: any): void {
    this.countSelected = 0;
    this.selectedElements = [];
    this.pageNumber == 1 ? this.selectedItems = [] : '';
    this.pageNumber == 1 ? this.isClear = false : '';
    this.pageNumber = event?.page + 1;
    // (this.isClear) ? '' : this.paginateHandler?.emit(event);
    this.paginateHandler?.emit(event);
    // this.dropdown.value = this.paginateOption;
  }
  paginatorOption(e: any): void {
    // e.value == 1 ? this.isClear = false : '';
    // (!e.value) ? '' : this.paginateOptionsHandler?.emit(e);
    this.paginateOptionsHandler?.emit(e);
    // this.paginateOption = e.value;
    // this.dropdown.value = e.value;
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }

  itemActionEmitter(item: any): void {
    this.itemActionHandler?.emit(item);
  }
  itemAssignUserActionEmitter(item: any): void {
    this.itemAssignUserHandler?.emit(item);
    this.collapseAssignMenu = false;
  }
  itemChangeStatusActionEmitter(item: any): void {
    this.itemChangeStatusHandler?.emit(item);
  }

  isInputElement(target: EventTarget): target is HTMLInputElement {
    return (target as HTMLInputElement).value !== undefined;
  }
  changeSelected(event: any, item: any): void {
    var index = this.selectedElements.findIndex((x: any) => x.id == item.id);
    console.log(index);
    if (event?.checked) {
      this.countSelected++;
      this.selectedElements.push(item)
    } else {
      this.countSelected--;
      this.selectedElements?.splice(index, 1)
    }
    this.countSelected == this.tableData?.length ? this.selectAll = true : this.selectAll = false;
    this.selectionHandler.emit(this.selectedElements);
    if (this.notesSelectedItems) {
      this.selectionHandler.emit({ items: this.selectedElements, item });
    } else {
      this.selectionHandler.emit(this.selectedElements);
    }
  }
  changeSelectedAll(event: any): void {
    this.selectAll = event?.checked;
    if (event?.checked) {
      this.tableData?.forEach((element: any) => {
        if (element.checked) {
          this.selectedElements?.forEach((selectedItem: any) => {
            if (element.id == selectedItem?.id) {
              console.log('lll');
            }
          })
        } else {
          element.checked = true;
          this.selectedElements?.push(element);
        }
      });
    } else {
      this.tableData?.forEach((element: any) => {
        element.checked = false;
        this.selectedElements?.splice(element, 1);
      });
    }
    if (this.notesSelectedItems) {
      this.selectionHandler.emit({ items: this.selectedElements, selectedAll: true });
      // this.selectAll = false;
    } else {
      this.selectionHandler.emit(this.selectedElements);
    }
  }
  onPaginatorPageChange(event: any) {
    // console.log('lkkkk');

    // const currentRowsPerPage = event.rows;
    // const rowsPerPageOptionsDropdown: any = document.querySelector('.p-dropdown-items');
    // console.log(rowsPerPageOptionsDropdown);
    // console.log(rowsPerPageOptionsDropdown?.nativeElement);
    // console.log(rowsPerPageOptionsDropdown?.nativeElement.children);
    // console.log(rowsPerPageOptionsDropdown?.children.blur());
    // console.log(rowsPerPageOptionsDropdown.nativeElement);

    // rowsPerPageOptionsDropdown.value = currentRowsPerPage;
  }
  onPage(event: any) {
    // const rowsPerPage = event.rows;
    // this.dt.rows = rowsPerPage;
  }
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }

  toggleSort(type: any, col: any): void {
    this.tableHeaders?.forEach((element: any) => {
      element.showAscSort = false;
      element.showDesSort = false;
      element.showDefaultSort = true;
    });
    if (type == 'asc') {
      col.showDefaultSort = false;
      col.showAscSort = true;
      col.showDesSort = false;
      this.customSortHandler?.emit({ field: col?.field, order: 1 });
    }
    if (type == 'des') {
      col.showDefaultSort = false;
      col.showAscSort = false;
      col.showDesSort = true;
      this.customSortHandler?.emit({ field: col?.field, order: -1 });
    }
  }
  clear(table: any): void {
    this.search.nativeElement.value = null;
    // this.dropdown.value = this.paginateOption;
    this.isClear = true;
    table?.clear();
    // this.clearHandler?.emit({ isClear: true });
    this.tableHeaders?.forEach((element: any) => {
      element.showAscSort = false;
      element.showDesSort = false;
      element.showDefaultSort = true;
    });
    this.collapse = false;
    this.collapseEnd = false;
  }
  customSort(event: any): void {
    console.log(event);
    // this.customSortHandler?.emit(event);
  }
  customFilter(event: any, dt: any): void {
    console.log(event);
    this.isFilter = true;
    dt.filteredValue = this.tableData;
    this.filtersTable = event?.filters;
    if (this.url?.includes('events-log')) {
      this.filtersTable['time'] = [
        {
          value: this.timeValue ? this.timeValue : null,
          matchMode: this.operator?.operator ? this.operator?.operator : 'timeIs',
          operator: 'and', type: 'time'
        }];
    }
    if (this.url?.includes('articles-quality')) {
      this.filtersTable['evaluation_request_time'] = [
        {
          value: this.timeValue ? this.timeValue : null,
          matchMode: this.operator?.operator ? this.operator?.operator : 'timeIs',
          operator: 'and', type: 'time'
        }];
      this.filtersTable['evaluation_time'] = [
        {
          value: this.timeValueEnd ? this.timeValueEnd : null,
          matchMode: this.operatorEnd?.operator ? this.operatorEnd?.operator : 'timeIs',
          operator: 'and', type: 'time'
        }];
    }
    if (this.url?.includes('bank-update')) {
      this.filtersTable['update_time'] = [
        {
          value: this.timeValue ? this.timeValue : null,
          matchMode: this.operator?.operator ? this.operator?.operator : 'timeIs',
          operator: 'and', type: 'time'
        }];
      this.filtersTable['request_time_evaluation'] = [
        {
          value: this.timeValueEnd ? this.timeValueEnd : null,
          matchMode: this.operatorEnd?.operator ? this.operatorEnd?.operator : 'timeIs',
          operator: 'and', type: 'time'
        }];
    }
    // this.filterHandler?.emit(this.filtersTable);
    console.log(this.filtersTable);
  }

  applyTime(field: any, type?: any): void {
    if (type == 'end') {
      this.collapseEnd = false;
      this.filtersTable[field] = [
        {
          value: this.timeValueEnd ? this.timeValueEnd : null,
          matchMode: this.operatorEnd?.operator ? this.operatorEnd?.operator : 'timeIs',
          operator: 'and', type: 'time'
        }];
    }
    else {
      this.collapse = false;
      this.filtersTable[field] = [
        {
          value: this.timeValue ? this.timeValue : null,
          matchMode: this.operator?.operator ? this.operator?.operator : 'timeIs',
          operator: 'and', type: 'time'
        }];
    }
    // console.log(this.filtersTable);
    this.filterHandler?.emit(this.filtersTable);
  }
  clearTime(): void {
    this.timeValueEnd = null;
    this.operatorEnd = null;
    this.timeValue = null;
    this.operator = null;
  }
  filterUsers(event: any): void {
    this.newAssignedUsers = this.assignedUsers?.filter((bank: any) => {
      return bank?.name?.toLocaleLowerCase()?.includes(event?.toLocaleLowerCase());
    });

  }
  clearSearchUserValue(search: any): void {
    search.value = '';
    this.newAssignedUsers = this.assignedUsers;
  }


  getDriverStatus(): any {
    this.driverStatusList = this.publicService.getDriverStatus();
    this.cdr.detectChanges();
  }
  getOrderStatus(): any {
    this.orderStatusList = this.publicService.getOrderStatus();
    this.cdr.detectChanges();
  }
  getIsWorking(): any {
    this.isWorkingList = this.publicService.getIsWorking();
    this.cdr.detectChanges();
  }
  getDistricts(): any {
    this.orderService?.getDistrictsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          res?.data[0]?.districts?.forEach((element: any) => {
            let name: any = '';
            name = this.currLang == 'ar' ? element?.arName : element?.enName;
            console.log(name);
            this.districtsList?.push({
              id: element?.id,
              value: element?.id,
              name: name,
            });
          });
          this.districtsList = res?.data[0]?.districts;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
      });
    this.cdr?.detectChanges();
  }
  getAllSupervisors(): any {
    this.supervisorsService?.getSupervisorsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          let arr: any = [];
          res?.data ? res?.data.forEach((item: any) => {
            arr.push({
              id: item?.id ? item?.id : null,
              name: item?.name ? item?.name : '',
              is_active: item?.is_active ? item?.is_active : false
            });
          }) : '';
          this.supervisorsList = arr;
        } else {
          res?.message ? this.alertsService.openSnackBar(res?.message) : '';
        }
      },
      (err: any) => {
        err?.message ? this.alertsService.openSnackBar(err?.message) : '';
      });
    this.cdr.detectChanges();

    let data: any = [
      { id: 1, name: 'Celine', is_active: true },
      { id: 2, name: 'nour', is_active: true },
      { id: 3, name: 'lorena', is_active: true },
      { id: 4, name: 'Ahmed', is_active: false },
      { id: 5, name: 'Ali', is_active: false },
      { id: 6, name: 'Kareem', is_active: true },
    ];
    this.supervisorsList = data;
  }
  getAllTanks(): any {
    this.tanksService?.getTanksList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          let arr: any = [];
          res?.data ? res?.data.forEach((item: any) => {
            arr.push({
              id: item?.id ? item?.id : null,
              name: item?.name ? item?.name : '',
              is_active: item?.is_active ? item?.is_active : false
            });
          }) : '';
          this.tanksList = arr;
        } else {
          res?.message ? this.alertsService.openSnackBar(res?.message) : '';
        }
      },
      (err: any) => {
        err?.message ? this.alertsService.openSnackBar(err?.message) : '';
      });
    this.cdr.detectChanges();

  }
  getAllDrivers(): any {
    this.driversService?.getDriversList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          let arr: any = [];
          res?.data ? res?.data.forEach((item: any) => {
            arr.push({
              id: item?.id ? item?.id : null,
              name: item?.name ? item?.name : ''
            });
          }) : '';
          this.driversList = arr;
        } else {
          res?.message ? this.alertsService.openSnackBar(res?.message) : '';
        }
      },
      (err: any) => {
        err?.message ? this.alertsService.openSnackBar(err?.message) : '';
      });
    this.cdr.detectChanges();

  }
  getPropertyType(): any {
    this.propertyTypeList = this.publicService?.getPropertyType();
    console.log(this.propertyTypeList);

    this.cdr.detectChanges();
  }
  getUserTypes(): any {
    this.userTypeList = this.publicService?.getUserTypes();

    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
