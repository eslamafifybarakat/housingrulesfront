import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  toggleSideMenu: boolean = false;
  moduleType: string = '';

  @Input() collapsed: boolean = false;
  @Input() screenWidth: any = 0;
  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService?.urlData?.subscribe((res: any) => {
      this.moduleType = res?.moduleType;
      console.log(this.moduleType);
    })

    this.sharedService?.showSideMenu?.subscribe((res: any) => {
      this.toggleSideMenu = res
    })
  }

  getDashClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768 && !this.toggleSideMenu) {
      styleClass = 'dash-trimmed';
    } else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0 && !this.toggleSideMenu) {
      styleClass = 'dash-md-screen';
    }
    return styleClass;
  }
}

