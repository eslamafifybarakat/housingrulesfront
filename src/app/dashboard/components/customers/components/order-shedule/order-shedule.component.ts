import { CustomersService } from './../../../../services/customers.service';
import { AlertsService } from 'src/app/core/services/alerts/alerts.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-order-shedule',
  templateUrl: './order-shedule.component.html',
  styleUrls: ['./order-shedule.component.scss']
})
export class OrderSheduleComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  isLoading: boolean = false;
  modalData: any;
  events: any = [];
  calendarOptions: any;

  constructor(
    private customersService: CustomersService,
    private alertsService: AlertsService,
    private config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.getByIdAsyncOrderSchedule(this.modalData?.id);

  }
  getByIdAsyncOrderSchedule(id: any): void {
    this.isLoading = true;
    this.customersService?.getByIdAsyncOrderSchedule(id)?.subscribe(
      (res: any) => {
        if (res?.isSuccess == true && res?.statusCode == 200) {
          this.isLoading = false;
          this.events = [
            { title: 'event 1', start: '2023-07-03T23:00:00', end: '2023-07-03T11:00:00' },
            { title: 'event 2', start: '2023-07-03T14:00:00', end: '2023-07-03T15:30:00' },
            { title: 'event 2', start: '2023-07-05T14:00:00', end: '2023-07-05T15:30:00' },
            { title: 'event 2', start: '2023-07-06T14:00:00', end: '2023-07-06T15:30:00' },
          ];
          this.calendarOptions = {
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            initialView: 'dayGridMonth',
            plugins: [dayGridPlugin, timeGridPlugin],
            events: this.events,
            eventTimeFormat: {
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
            },
            timeFormat: 'h:mm a',
            validRange: {
              start: new Date().toISOString().split('T')[0]
            }
          };
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
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
