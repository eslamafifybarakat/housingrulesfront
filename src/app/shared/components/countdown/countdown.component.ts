import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  data: any;
  countDownDate: any;
  currentUrl: string = '';

  @Input() customTitle: any;
  @Output() emitServicePrice = new EventEmitter();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.emitServicePrice.next({
      end: false
    });

    this.data = this.customTitle;
    this.countDownDate = new Date(this.data).getTime();

    // Get Current URL Routing
    this.currentUrl = this.router.url.split(/[?#]/)[0];
    console.log(this.currentUrl);
  }

  demo: any;
  x = setInterval(() => {
    var now = new Date().getTime();
    var distance = this.countDownDate - now;
    if (distance <= 0) {
      console.log("Time ended");
      this.emitServicePrice.next({
        end: true
      });
    }
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var second = Math.floor((distance % (1000 * 60)) / 1000);
    if (days > 0) {
      this.demo = days + ':' + hours;
    } else if (hours > 0) {
      this.demo = hours + ':' + minutes;
    } else if (minutes > 0) {
      this.demo = minutes + ':' + second;
    } else {
      this.demo = '00' + ':' + second;
    }

    if (distance <= 0) {
      clearInterval(this.x);
      this.demo = "Expired";
    }
  });
}

