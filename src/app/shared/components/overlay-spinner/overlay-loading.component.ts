import { PublicService } from './../../services/public.service';
import { SharedService } from './../../services/shared.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overlay-loading',
  templateUrl: './overlay-loading.component.html',
  styleUrls: ['./overlay-loading.component.scss']
})
export class OverlayLoadingComponent implements OnInit {
  show_overlay: boolean = false;
  show_loader: boolean = false;
  constructor(private publicService: PublicService) { }

  ngOnInit(): void {
    this.publicService.show_loader.subscribe((res: any) => {
      if (res == true) {
        this.show_overlay = true;
        this.show_loader = true;
      } else {
        this.show_overlay = false;
        this.show_loader = false;
      }
    });
  }
}
