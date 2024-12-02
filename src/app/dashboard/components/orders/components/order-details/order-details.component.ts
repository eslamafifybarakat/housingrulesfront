import { environment } from './../../../../../../environments/environment';
import { OrdersService } from 'src/app/dashboard/services/orders.service';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import { DriversService } from './../../../../services/drivers.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  private hubConnection: signalR.HubConnection | undefined;

  modalData: any;
  orderId: any;
  dateTime: any;
  time: any;
  propertyType: any;
  isLoading: boolean = false;
  orderDetails: any;
  orderOriginList: any = [];
  propertyTypeList: any = [];
  paymentMethodList: any = [];
  cancellationCauses: any = [];
  tableHeaders: any = [];
  orderHistory: any = [];

  constructor(
    private driversService: DriversService,
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.orderId = this.modalData?.id;
    this.dateTime = this.modalData?.dateTime;
    this.propertyType = this.modalData?.propertyType ? this.modalData?.propertyType[0]?.name : '';
    const date = new Date(this.dateTime);
    const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
    this.time = date.toLocaleString('en-US', options);
    this.propertyTypeList = this.publicService?.getPropertyType();
    this.orderOriginList = this.publicService?.getOrderOrigin();
    this.paymentMethodList = this.publicService?.getPaymentMethods();
    this.cancellationCauses = this.publicService?.getOrdersCancellationReasons();
    this.getByIdAsyncOrderSchedule(this.modalData?.id);
    this.tableHeaders = [
      { field: 'oldStatus', header: this.publicService?.translateTextFromJson('general.oldStatus'), title: this.publicService?.translateTextFromJson('general.oldStatus'), type: 'filterArray', dataType: 'array', list: 'orderStatus', status: true, statusType: 'old' },
      { field: 'newStatus', header: this.publicService?.translateTextFromJson('general.newStatus'), title: this.publicService?.translateTextFromJson('general.newStatus'), type: 'filterArray', dataType: 'array', list: 'orderStatus', status: true, statusType: 'new' },
      { field: 'createdDate', header: this.publicService?.translateTextFromJson('general.createdDate'), title: this.publicService?.translateTextFromJson('general.createdDate'), type: 'date' },

    ];
    this.startConnection();
  }

  edit(): void {
    this.ref?.close();
    this.router.navigate(['/dashboard/addOrder', { id: this.orderId }]);
  }
  getByIdAsyncOrderSchedule(id: any, preventLoading?: boolean): void {
    preventLoading ? '' : this.isLoading = true;
    this.ordersService?.getByIdAsync(id)?.subscribe(
      (res: any) => {
        if (res?.isSuccess == true && res?.statusCode == 200) {
          this.isLoading = false;
          let arr: any = [];
          let item = res?.data;
          let status: any = '';
          let statusClass: any = '';
          let statusValue: any;
          if (item?.status == 1) {
            status = this.publicService.translateTextFromJson('general.pending');
            statusClass = 'warning';
            statusValue = 1;
          }
          if (item?.status == 2) {
            status = this.publicService.translateTextFromJson('general.assignedToDriver');
            statusClass = 'primary';
            statusValue = 2;
          }
          if (item?.status == 3) {
            status = this.publicService.translateTextFromJson('general.driverOnWayToCustomer');
            statusClass = 'gray';
            statusValue = 3;
          }
          if (item?.status == 4) {
            status = this.publicService.translateTextFromJson('general.driverArrivedToCustomer');
            statusClass = 'cyan';
            statusValue = 4;
          }
          if (item?.status == 5) {
            status = this.publicService.translateTextFromJson('general.driverOnWayToStation');
            statusClass = 'purple';
            statusValue = 5;
          }
          if (item?.status == 6) {
            status = this.publicService.translateTextFromJson('general.driverArrivedToStation');
            statusClass = 'cyan';
            statusValue = 6;
          }
          if (item?.status == 7) {
            status = this.publicService.translateTextFromJson('general.completed');
            statusClass = 'success';
            statusValue = 7;
          }
          if (item?.status == 8) {
            status = this.publicService.translateTextFromJson('general.cancelled');
            statusClass = 'danger';
            statusValue = 8;
          }
          let orderOrigin: any;
          this.orderOriginList?.forEach((element: any) => {
            if (element?.value == item?.orderOrigin) {
              orderOrigin = element?.name
            }
          });
          let propertyType: any = [];
          this.propertyTypeList?.forEach((element: any) => {
            if (element?.value == item?.propertyType) {
              propertyType?.push(element);
            }
          });
          let paymentMethod: any = '';
          this.paymentMethodList?.forEach((element: any) => {
            if (element?.value == item?.paymentMethod) {
              paymentMethod = element?.name;
            }
          });
          let sizeTank: any;
          if (item?.tankSize == 1) {
            sizeTank = "Size15";
          }
          if (item?.tankSize == 2) {
            sizeTank = "Size20";
          }
          if (item?.tankSize == 3) {
            sizeTank = "Size32";
          }
          let cancellationCausesText: any = '';
          this.cancellationCauses?.forEach((element: any) => {
            if (element?.id == item?.cancellatinCauses) {
              cancellationCausesText = element?.name;
            }
          });
          this.orderDetails = {
            id: item?.id ? item?.id : null,
            dateTime: item?.dateTime ? new Date(item?.dateTime) : null,
            lastModifiedDate: item?.lastModifiedDate ? new Date(item?.lastModifiedDate) : null,
            orderOrigin: orderOrigin,
            createdByStr: item?.createdByStr ? item?.createdByStr : '',
            orderNumber: item?.orderNumber ? item?.orderNumber : '',
            propertyType: propertyType,
            customerMobileNumber: item?.customerMobileNumber ? item?.customerMobileNumber : '',
            district: item?.district ? item?.district : '',
            locationLink: item?.locationLink ? item?.locationLink : null,
            tankSize: this.publicService?.translateTextFromJson('dashboard.tanks.TankSize.' + sizeTank),
            status: status,
            statusValue: statusValue,
            statusClass: statusClass,
            paymentMethod: paymentMethod,
            paidAmount: item?.paidAmount ? item?.paidAmount : '0',
            cancellationCauses: item?.cancellatinCauses ? cancellationCausesText : '',
            closedAt: item?.closedAt ? item?.closedAt : '',
            supervisor: item?.supervisor ? item?.supervisor : '',
            driver: item?.driver ? item?.driver : '',
            customer: item?.customer ? item?.customer : '',
            comments: item?.comments ? item?.comments : '',
            cancellationDesc: item?.cancellationDesc ? item?.cancellationDesc : '',
            isVip: item?.isVip ? item?.isVip : false,
            orderHistory: item?.orderHistory ? item?.orderHistory : []
          };
          this.orderDetails?.orderHistory.forEach((item: any) => {
            let status: any = '';
            let oldStatus: any = '';
            let newStatus: any = '';
            let oldStatusClass: any = '';
            let newStatusClass: any = '';
            let statusValue: any;
            if (item?.oldStatus == 1) {
              oldStatus = this.publicService.translateTextFromJson('general.pending');
              oldStatusClass = 'warning';
              statusValue = 1;
            }
            if (item?.oldStatus == 2) {
              oldStatus = this.publicService.translateTextFromJson('general.assignedToDriver');
              oldStatusClass = 'primary';
              statusValue = 2;
            }
            if (item?.oldStatus == 3) {
              oldStatus = this.publicService.translateTextFromJson('general.driverOnWayToCustomer');
              oldStatusClass = 'gray';
              statusValue = 3;
            }
            if (item?.oldStatus == 4) {
              oldStatus = this.publicService.translateTextFromJson('general.driverArrivedToCustomer');
              oldStatusClass = 'cyan';
              statusValue = 4;
            }
            if (item?.oldStatus == 5) {
              oldStatus = this.publicService.translateTextFromJson('general.driverOnWayToStation');
              oldStatusClass = 'purple';
              statusValue = 5;
            }
            if (item?.oldStatus == 6) {
              oldStatus = this.publicService.translateTextFromJson('general.driverArrivedToStation');
              oldStatusClass = 'cyan';
              statusValue = 6;
            }
            if (item?.oldStatus == 7) {
              oldStatus = this.publicService.translateTextFromJson('general.completed');
              oldStatusClass = 'success';
              statusValue = 7;
            }
            if (item?.oldStatus == 8) {
              oldStatus = this.publicService.translateTextFromJson('general.cancelled');
              oldStatusClass = 'danger';
              statusValue = 8;
            }

            if (item?.newStatus == 1) {
              newStatus = this.publicService.translateTextFromJson('general.pending');
              newStatusClass = 'warning';
              statusValue = 1;
            }
            if (item?.newStatus == 2) {
              newStatus = this.publicService.translateTextFromJson('general.assignedToDriver');
              newStatusClass = 'primary';
              statusValue = 2;
            }
            if (item?.newStatus == 3) {
              newStatus = this.publicService.translateTextFromJson('general.driverOnWayToCustomer');
              newStatusClass = 'gray';
              statusValue = 3;
            }
            if (item?.newStatus == 4) {
              newStatus = this.publicService.translateTextFromJson('general.driverArrivedToCustomer');
              newStatusClass = 'cyan';
              statusValue = 4;
            }
            if (item?.newStatus == 5) {
              newStatus = this.publicService.translateTextFromJson('general.driverOnWayToStation');
              newStatusClass = 'purple';
              statusValue = 5;
            }
            if (item?.newStatus == 6) {
              newStatus = this.publicService.translateTextFromJson('general.driverArrivedToStation');
              newStatusClass = 'cyan';
              statusValue = 6;
            }
            if (item?.newStatus == 7) {
              newStatus = this.publicService.translateTextFromJson('general.completed');
              newStatusClass = 'success';
              statusValue = 7;
            }
            if (item?.newStatus == 8) {
              newStatus = this.publicService.translateTextFromJson('general.cancelled');
              newStatusClass = 'danger';
              statusValue = 8;
            }
            this.orderHistory?.push({
              oldStatus: oldStatus,
              newStatus: newStatus,
              createdDate: item?.createdDate,
              statusValue: statusValue,
              oldStatusClass: oldStatusClass,
              newStatusClass: newStatusClass,
            })
          });

        } else {
          this.isLoading = false;
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
        }
      },

      (err: any) => {
        this.isLoading = false;
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
      });
  }
  public startConnection = () => {
    let url = environment?.apiUrl.substring(0, environment.apiUrl.length - 4) + '/OrderStatusHub';
    this.hubConnection = new signalR.HubConnectionBuilder().withAutomaticReconnect()
      .withUrl(url)
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = 100000; // 100 second
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('NotifyNewOrderCreated', (data, user) => {
      // this.getByIdAsyncOrderSchedule(this.modalData?.id);
    });
    this.hubConnection.on('NotifyOrderStatus', (orderId, orderStatus) => {
      if (orderId == this.modalData?.id) {
        this.getByIdAsyncOrderSchedule(this.modalData?.id, true);
      }
      // this.updateOrderStatus(orderId, orderStatus);
    });
  }
  cancel(): void {
    this.ref?.close({ listChanged: false });
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
