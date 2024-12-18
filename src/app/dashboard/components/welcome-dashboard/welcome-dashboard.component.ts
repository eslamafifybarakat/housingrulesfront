import {
  basicOptions,
  basicOptionsHorizontal,
  doughnutChartOptions,
  polarAreaChartOptions,
  pieChartOptions,
  stackedOptions,
  stackedOptionsHorizontal,
  barStackedOptions,
} from './welcome';
import { AlertsService } from 'src/app/core/services/alerts/alerts.service';
import { PublicService } from './../../../shared/services/public.service';
import { SupervisorsService } from '../../services/supervisors.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { keys } from './../../../shared/configs/localstorage-key';
import { OrdersService } from '../../services/orders.service';
import { Subscription } from 'rxjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { plugins } from 'chart.js';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-welcome-dashboard',
  templateUrl: './welcome-dashboard.component.html',
  styleUrls: ['./welcome-dashboard.component.scss'],
})
export class WelcomeDashboardComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  stackedData: any;
  stackedOptions: any = stackedOptions;
  barStackedOptions: any = barStackedOptions;
  doughnutData: any;
  requestsData: any;
  doughnutChartOptions: any = doughnutChartOptions;
  polarAreaData: any;
  polarAreaChartOptions: any = polarAreaChartOptions;
  pieChartOptions: any = pieChartOptions;
  basicData: any;
  basicOptions: any = basicOptions;
  orderList: any;
  isLoadingOrder: boolean = false;
  tankSizes: any = [];
  tankSizesChart: any = [];
  requestTypesChart: any = [];
  supervisorsList: any = [];
  supervisorsNamesChart: any = [];
  driverOnWayToCustomerChart: any = [];
  pendingChart: any = [];
  driverOnWayToStationChart: any = [];
  completedChart: any = [];
  orderResourcesChart: any = [];
  allSupervisorsNamesChart: any = [];
  InCustomerServiceChart: any = [];
  underConstructionChart: any = [];
  workUnderwayChart: any = [];
  serviceDoneChart: any = [];
  cancelledChart: any = [];
  typeValue: any;
  typeValueOfStatus: any;
  type: any = [
    {
      id: 1,
      value: 'horizontal',
      name: this.publicService?.translateTextFromJson('general.horizontal'),
    },
    {
      id: 2,
      value: 'vertical',
      name: this.publicService?.translateTextFromJson('general.vertical'),
    },
  ];
  currentLanguage: any;
  plugins: any;
  totalRequests: number = 0;

  @ViewChild('chart') chart: ChartComponent | any;

  constructor(
    private supervisorsService: SupervisorsService,
    private publicService: PublicService,
    private ordersService: OrdersService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    this.getAllOrders();
    this.tankSizes = this.publicService?.getTanksSizes();
    this.typeValue = {
      id: 2,
      value: 'vertical',
      name: this.publicService?.translateTextFromJson('general.vertical'),
    };
    this.typeValueOfStatus = {
      id: 2,
      value: 'vertical',
      name: this.publicService?.translateTextFromJson('general.vertical'),
    };
  }

  getAllOrders(): any {
    this.isLoadingOrder = true;
    this.ordersService
      ?.getOrdersEntityList(0, 0, '', 0, 0, 1, 0, 0, 0, 0, 0)
      ?.subscribe(
        (res: any) => {
          if (res?.statusCode == 200 && res?.isSuccess == true) {
            this.orderList = res?.data ? res?.data : [];
            this.calcTankSizes(this.orderList);
            this.getAllSupervisors();
            this.calcOrderResources(this.orderList);
            this.calcTotalRequestTypes(this.orderList);
          } else {
            res?.message
              ? this.alertsService?.openSweetAlert('info', res?.message)
              : '';
            this.isLoadingOrder = false;
          }
        },
        (err: any) => {
          err?.message
            ? this.alertsService?.openSweetAlert('error', err?.message)
            : '';
          this.isLoadingOrder = false;
        }
      );
    this.cdr?.detectChanges();
  }

  calcTankSizes(data: any): void {
    let size1: any = 0;
    let size2: any = 0;
    let size3: any = 0;
    data?.forEach((item: any) => {
      if (item?.tankSize == this.tankSizes[0]?.value) {
        size1 = size1 + 1;
      }
      if (item?.tankSize == this.tankSizes[1]?.value) {
        size2 = size2 + 1;
      }
      if (item?.tankSize == this.tankSizes[2]?.value) {
        size3 = size3 + 1;
      }
    });
    this.tankSizesChart = [size1, size2, size3];
    this.doughnutData = {
      labels: [
        this.publicService?.translateTextFromJson(
          'dashboard.tanks.TankSize.Size15'
        ),
        this.publicService?.translateTextFromJson(
          'dashboard.tanks.TankSize.Size20'
        ),
        this.publicService?.translateTextFromJson(
          'dashboard.tanks.TankSize.Size32'
        ),
      ],
      datasets: [
        {
          data: this.tankSizesChart,
          backgroundColor: ['#09d891', '#FF6384', '#FFCE56'],
          hoverBackgroundColor: ['#09d891', '#FF6384', '#FFCE56'],
        },
      ],
    };
  }

  calcTotalRequestTypes(data: any): void {
    let requestCompelete: any = 0;
    let requestPending: any = 0;
    let requestCanceled: any = 0;
    let requestRunning: any = 0;

    data?.forEach((item: any) => {
      if (item?.status == 7) {
        requestCompelete = requestCompelete + 1;
      } else if (item?.status == 8) {
        requestCanceled = requestCanceled + 1;
      } else if (item?.status == 1) {
        requestPending = requestPending + 1;
      } else {
        requestRunning = requestRunning + 1;
      }
    });
    this.requestTypesChart = [
      requestCompelete,
      requestPending,
      requestCanceled,
      requestRunning,
    ];

    this.totalRequests =
      requestCompelete + requestPending + requestCanceled + requestRunning;

    this.requestsData = {
      labels: [
        this.publicService?.translateTextFromJson('welcome.completed') +
          ' ' +
          requestCompelete,
        this.publicService?.translateTextFromJson('welcome.pending') +
          ' ' +
          requestPending,
        this.publicService?.translateTextFromJson('welcome.cancel') +
          ' ' +
          requestCanceled,
        this.publicService?.translateTextFromJson('welcome.run') +
          ' ' +
          requestRunning,
      ],
      datasets: [
        {
          data: this.requestTypesChart,
          backgroundColor: ['#50cd89', '#E4DCCF', '#EA5455', '#26527e'],
          hoverBackgroundColor: ['#50cd89', '#E4DCCF', '#EA5455', '#26527e'],
        },
      ],
    };
  }

  calcOrderResources(data: any): void {
    let field: any = 0;
    4;
    let whatsapp: any = 0;
    1;
    let call: any = 0;
    3;
    let tms: any = 0;
    2;
    let others: any = 0;
    5;
    data?.forEach((item: any) => {
      if (item?.orderOrigin == 1) {
        whatsapp = whatsapp + 1;
      }
      if (item?.orderOrigin == 2) {
        tms = tms + 1;
      }
      if (item?.orderOrigin == 3) {
        call = call + 1;
      }
      if (item?.orderOrigin == 4) {
        field = field + 1;
      }
      if (item?.orderOrigin == 5) {
        others = others + 1;
      }
    });
    this.orderResourcesChart = [field, whatsapp, call, tms, others];
    this.polarAreaData = {
      datasets: [
        {
          data: this.orderResourcesChart,
          backgroundColor: [
            '#fdc604',
            '#50cd89',
            '#818ea1',
            '#743aef',
            '#EA5455',
          ],
          label: '',
        },
      ],
      labels: [
        this.publicService?.translateTextFromJson('general.field') +
          ' ' +
          field,
        this.publicService?.translateTextFromJson('general.whatsapp') +
          ' ' +
          whatsapp,
        this.publicService?.translateTextFromJson('general.call') + ' ' + call,
        this.publicService?.translateTextFromJson('general.tms') + ' ' + tms,
        this.publicService?.translateTextFromJson('general.others') +
          ' ' +
          others,
      ],
    };

    this.plugins = [ChartDataLabels];

    //============ PolarChart ======
    // let field: any = 0;
    // 4;
    // let whatsapp: any = 0;
    // 1;
    // let call: any = 0;
    // 3;
    // let tms: any = 0;
    // 2;
    // let others: any = 0;
    // 5;
    // data?.forEach((item: any) => {
    //   if (item?.orderOrigin == 1) {
    //     whatsapp = whatsapp + 1;
    //   }
    //   if (item?.orderOrigin == 2) {
    //     tms = tms + 1;
    //   }
    //   if (item?.orderOrigin == 3) {
    //     call = call + 1;
    //   }
    //   if (item?.orderOrigin == 4) {
    //     field = field + 1;
    //   }
    //   if (item?.orderOrigin == 5) {
    //     others = others + 1;
    //   }
    // });
    // this.orderResourcesChart = [field, whatsapp, call, tms, others];
    // this.polarAreaData = {
    //   datasets: [
    //     {
    //       data: this.orderResourcesChart,
    //       backgroundColor: [
    //         '#fdc604',
    //         '#50cd89',
    //         '#818ea1',
    //         '#743aef',
    //         '#EA5455',
    //       ],
    //       label: 'My dataset',
    //     },
    //   ],
    //   labels: [
    //     this.publicService?.translateTextFromJson('general.field'),
    //     this.publicService?.translateTextFromJson('general.whatsapp'),
    //     this.publicService?.translateTextFromJson('general.call'),
    //     this.publicService?.translateTextFromJson('general.tms'),
    //     this.publicService?.translateTextFromJson('general.others'),
    //   ],
    // };

    // this.plugins = [ChartDataLabels];
  }

  calcSupervisorOrderStatusNumbers(data: any): void {
    let completed: any = 0;
    let driverOnWayToStation: any = 0;
    let pending: any = 0;
    let driverOnWayToCustomer: any = 0;
    let  cancelled : any = 0;
    let supervisorData: any = [];
    let supervisorName: any = '';
    this.supervisorsList?.forEach((element: any) => {
      supervisorName =
        this.currentLanguage == 'ar' ? element?.arName : element?.enName;
      pending = 0;
      driverOnWayToCustomer = 0;
      driverOnWayToStation = 0;
      completed = 0;
      cancelled = 0;
      data?.forEach((item: any) => {
        if (element?.id == item?.supervisorId) {
          if (item?.status == 7) {
            completed = completed + 1;
          }
          if (item?.status == 5) {
            driverOnWayToStation = driverOnWayToStation + 1;
          }
          if (item?.status == 1) {
            pending = pending + 1;
          }
          if (item?.status == 3) {
            driverOnWayToCustomer = driverOnWayToCustomer + 1;
          }
          if (item?.status == 8) {
            cancelled = cancelled + 1;
          }
        }
      });
      supervisorData?.push({
        supervisorName: supervisorName,
        driverOnWayToCustomer: driverOnWayToCustomer,
        pending: pending,
        driverOnWayToStation: driverOnWayToStation,
        completed: completed,
        cancelled :  cancelled
      });
    });

    supervisorData?.forEach((item: any) => {
      if (item) {
        this.supervisorsNamesChart?.push(item?.supervisorName);
        this.completedChart?.push(item?.completed);
        this.pendingChart?.push(item?.pending);
        this.driverOnWayToCustomerChart?.push(item?.driverOnWayToCustomer);
        this.driverOnWayToStationChart?.push(item?.driverOnWayToStation);
        this.cancelledChart?.push(item?.cancelled);
      }
    });
    this.basicData = {
      labels: this.supervisorsNamesChart,
      datasets: [
        {
          label: this.publicService?.translateTextFromJson('general.completed'),
          backgroundColor: '#0c5b40',
          data: this.completedChart,
          categoryPercentage: 1,
          barPercentage: 0.7,
        },
        {
          label: this.publicService?.translateTextFromJson(
            'general.driverOnWayToStation'
          ),
          backgroundColor: '#32b2b',
          data: this.driverOnWayToStationChart,
          categoryPercentage: 1,
          barPercentage: 0.7,
        },
        {
          label: this.publicService?.translateTextFromJson('general.pending'),
          backgroundColor: '#1D267D',
          data: this.pendingChart,
          categoryPercentage: 1,
          barPercentage: 0.7,
        },
        {
          label: this.publicService?.translateTextFromJson(
            'general.driverOnWayToCustomer'
          ),
          backgroundColor: '#808080',
          data: this.driverOnWayToCustomerChart,
          categoryPercentage: 1,
          barPercentage: 0.7,
        },
        {
          label: this.publicService?.translateTextFromJson('general.cancelled'),
          backgroundColor: '#EA5455',
          data: this.cancelledChart,
          categoryPercentage: 1,
          barPercentage: 0.7,
        },
      ],
    };
  }

  calcSupervisorAllOrderStatus(data: any): void {
    let completed: any = 0;
    let cancelled: any = 0;
    let pending: any = 0;
    let assignedToDriver: any = 0;
    let driverArrivedToCustomer: any = 0;
    let supervisorData: any = [];
    let supervisorName: any = '';
    this.supervisorsList?.forEach((element: any) => {
      supervisorName =
        this.currentLanguage == 'ar' ? element?.arName : element?.enName;
      pending = 0;
      assignedToDriver = 0;
      driverArrivedToCustomer = 0;
      completed = 0;
      cancelled = 0;
      data?.forEach((item: any) => {
        if (element?.id == item?.supervisorId) {
          if (item?.status == 1) {
            pending = pending + 1;
          }
          if (item?.status == 2) {
            assignedToDriver = assignedToDriver + 1;
          }
          if (item?.status == 4) {
            driverArrivedToCustomer = driverArrivedToCustomer + 1;
          }
          if (item?.status == 7) {
            completed = completed + 1;
          }
          if (item?.status == 8) {
            cancelled = cancelled + 1;
          }
        }
      });
      supervisorData?.push({
        supervisorName: supervisorName,
        assignedToDriver: assignedToDriver,
        pending: pending,
        driverArrivedToCustomer: driverArrivedToCustomer,
        completed: completed,
        cancelled: cancelled,
      });
    });

    supervisorData?.forEach((item: any) => {
      if (item) {
        this.allSupervisorsNamesChart?.push(item?.supervisorName);
        this.serviceDoneChart?.push(item?.completed);
        this.workUnderwayChart?.push(item?.pending);
        this.InCustomerServiceChart?.push(item?.driverArrivedToCustomer);
        this.underConstructionChart?.push(item?.assignedToDriver);
        this.cancelledChart?.push(item?.cancelled);
      }
    });

    this.stackedData = {
      labels: this.allSupervisorsNamesChart,
      datasets: [
        {
          type: 'bar',
          label: this.publicService?.translateTextFromJson(
            'general.serviceDone'
          ),
          backgroundColor: '#025464',
          barThickness: 30,
          borderRadius: 4,
          data: this.serviceDoneChart,
        },
        {
          type: 'bar',
          label: this.publicService?.translateTextFromJson(
            'general.workUnderway'
          ),
          backgroundColor: '#0c5b40',
          barThickness: 30,
          borderRadius: 4,
          data: this.workUnderwayChart,
        },
        {
          type: 'bar',
          label: this.publicService?.translateTextFromJson(
            'general.underConstruction'
          ),
          backgroundColor: '#ccc',
          barThickness: 30,
          borderRadius: 4,
          data: this.underConstructionChart,
        },
        {
          type: 'bar',
          label: this.publicService?.translateTextFromJson(
            'general.InCustomerService'
          ),
          backgroundColor: '#E8AA42',
          barThickness: 30,
          borderRadius: 4,
          data: this.InCustomerServiceChart,
        },
        {
          type: 'bar',
          label: this.publicService?.translateTextFromJson('general.cancelled'),
          backgroundColor: '#D21312',
          barThickness: 30,
          borderRadius: 4,
          data: this.cancelledChart,
        },
      ],
    };
  }

  getAllSupervisors(): any {
    this.supervisorsService?.getSupervisorsList()?.subscribe(
      (res: any) => {
        if (res?.statusCode == 200 && res?.isSuccess == true) {
          this.supervisorsList = res?.data ? res?.data : [];
          this.calcSupervisorOrderStatusNumbers(this.orderList);
          this.calcSupervisorAllOrderStatus(this.orderList);
          this.isLoadingOrder = false;
        } else {
          res?.message ? this.alertsService.openSnackBar(res?.message) : '';
          this.isLoadingOrder = false;
        }
      },
      (err: any) => {
        err?.message ? this.alertsService.openSnackBar(err?.message) : '';
        this.isLoadingOrder = false;
      }
    );
    this.cdr.detectChanges();
  }

  ChangeType(event: any, type?: any): void {
    if (event?.value?.value == 'horizontal') {
      this.barStackedOptions = stackedOptionsHorizontal;
    } else {
      this.barStackedOptions = barStackedOptions;
    }
  }

  ChangeTypeOfStatus(event: any): void {
    if (event?.value?.value == 'horizontal') {
      this.stackedOptions = stackedOptionsHorizontal;
    } else {
      this.stackedOptions = stackedOptions;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
