import { Observable, Subscription, finalize, map } from 'rxjs';
import { PublicService } from './../../../shared/services/public.service';
import { FinancialSettlementsService } from './../../services/financial-settlements.service';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmCompleteOrderComponent } from '../orders/components/confirm-complete-order/confirm-complete-order.component';
import { keys } from 'src/app/shared/configs/localstorage-key';

@Component({
  selector: 'app-financial-settlements',
  templateUrl: './financial-settlements.component.html',
  styleUrls: ['./financial-settlements.component.scss']
})
export class FinancialSettlementsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  isLoadingFileDownload: boolean = false;

  loadingIndicator: boolean = false;
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


  isLoading: boolean = false;
  usersList: any = [];
  financialSettlementsList: any = [];
  activeIndex: any;
  total: number = 0;

  userLoginDataType: any;

  selectedrecivedby: any;
  constructor(
    private financialSettlementsService: FinancialSettlementsService,
    private alertsService: AlertsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.userLoginDataType = JSON.parse(window.localStorage.getItem(keys.userLoginData) || '{}')?.userType;
    this.tableHeaders = [
      { field: 'orderId', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.id'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.id'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
      { field: 'orderNumber', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderNumber'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.orderNumber'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'numeric' },
      { field: 'amount', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.price'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.amount'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'numeric' },
       { field: 'driver', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.driver'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.driver'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text' },
       { field: 'createdDate', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.createdAt'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.createdAt'), sort: false, filter: false, type: 'date' },
    ];
    this.getUsers();
  }

  getUsers(): any {
    this.isLoading = true;
    this.financialSettlementsService?.getUsers()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          let arr: any = [];
          res?.data ? res?.data?.forEach((item: any) => {
            arr.push({
              id: item?.id ? item?.id : '',
              userNameStr: item?.userNameStr ? item?.userNameStr : '',
              username: item?.username ? item?.username : '',
              isActive: false
            });
          }) : '';
          this.usersList = arr;
          this.isLoading = false;
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.isLoading = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.isLoading = false;
      });
    this.cdr?.detectChanges();
  }

  getAllByRecivedByAsync(id: any, index: any): any {
    this.loadingIndicator = true;
    this.selectedrecivedby = id;
    this.financialSettlementsService?.getAllByRecivedByAsync(id)
      .pipe(
        map((res: any) => {
          let arr: any = [];
          res?.data ? res?.data?.forEach((item: any) => {
            arr.push({
              orderId: item?.orderId ? item?.orderId : 0,
              orderNumber: item?.orderNumber ? item?.orderNumber : '0',
              amount: item?.amount ? item?.amount : '0',
              driver: item?.driver ? item?.driver : '',
              createdDate: item?.createdDate ? new Date(item?.createdDate) : '',
            });
          }) : '';
          this.financialSettlementsList = arr;
          this.getTotal();
          this.usersList?.forEach((item: any) => {
            if (id == item?.id) {
              item.isActive = true;
            } else {
              item.isActive = false;
            }
          });
        }),
        finalize(() => {
          this.loadingIndicator = false;
        })

      ).subscribe((res: any) => {
      });

    // let data: any = [
    //   { orderId: 2, orderNumber: 22222222222, amount: 11, driver: 'mohamed', createdAt: new Date(), orderCount: 8, recivedBy: 'Ali', settlementedBy: 'marwan' },
    //   { orderId: 4, orderNumber: 22222222222, amount: 11, driver: 'mohamed', createdAt: new Date(), orderCount: 8, recivedBy: 'Ali', settlementedBy: 'marwan' },
    //   { orderId: 2, orderNumber: 22222222222, amount: 11, driver: 'mohamed', createdAt: new Date(), orderCount: 8, recivedBy: 'Ali', settlementedBy: 'marwan' },
    //   { orderId: 2, orderNumber: 22222222222, amount: 11, driver: 'mohamed', createdAt: new Date(), orderCount: 8, recivedBy: 'Ali', settlementedBy: 'marwan' },
    //   { orderId: 2, orderNumber: 22222222222, amount: 11, driver: 'mohamed', createdAt: new Date(), orderCount: 8, recivedBy: 'Ali', settlementedBy: 'marwan' },
    //   { orderId: 2, orderNumber: 22222222222, amount: 11, driver: 'mohamed', createdAt: new Date(), orderCount: 8, recivedBy: 'Ali', settlementedBy: 'marwan' },
    //   { orderId: 2, orderNumber: 22222222222, amount: 11, driver: 'mohamed', createdAt: new Date(), orderCount: 8, recivedBy: 'Ali', settlementedBy: 'marwan' },

    // ];
    // this.financialSettlementsList = data;
  }

  getTotal(): void {
    let tot = 0;
    this.financialSettlementsList?.forEach((item: any) => {
      tot =tot + Number.parseInt( item?.amount);
    });
    this.total = tot;
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
  confirmOrder(item?: any): void {
    const ref = this.dialogService?.open(ConfirmCompleteOrderComponent, {
      data: {
        item: item
      },
      header: this.publicService?.translateTextFromJson('general.confirm_order'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.confirmed) {
        this.publicService.show_loader.next(true);
    const myObject: { [key: string]: any } = {};
    myObject['amount'] = this.total ;
    myObject['recivedBy'] = this.selectedrecivedby;
    myObject['settlementedBy'] = this.userLoginDataType?.userId;
        this.financialSettlementsService.addFinancialSettlemente(myObject)?.subscribe(
          (res: any) => {
            if (res?.isSuccess == true) {
              this.publicService?.show_loader?.next(false);
              res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
              this.getAllByRecivedByAsync(this.selectedrecivedby,0);
            } else {
              res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
              this.publicService?.show_loader?.next(false);
            }
          },
          (err: any) => {
            err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
            this.publicService?.show_loader?.next(false);
          });
      }

      // if (res?.listChanged) {
      //   this.page = 1;
      //   this.publicService?.changePageSub?.next({ page: this.page });
      //   this.getAllGates();
      // }
    });
  }
}
