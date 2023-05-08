import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.component.html',
  styleUrls: ['./no-internet.component.scss']
})
export class NoInternetComponent implements OnInit {

  constructor(
    private location: Location,
  ) { }

  ngOnInit(): void {
  }

  reload(): void {
    this.location?.back();
  }
}
