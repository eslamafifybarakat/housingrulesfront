import { PublicService } from './../../../shared/services/public.service';
import { SharedService } from './../../../shared/services/shared.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { keys } from './../../../shared/configs/localstorage-key';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { menuList } from './menu-list';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss']
})
export class AsideMenuComponent implements OnInit {
  collapsed: boolean = false;
  screenWidth: any = 0;

  showSideMenu: boolean = true;
  rotated: boolean = false;
  show: boolean = false;
  menuList: any;

  currentLanguage: string = 'en';

  @Output() onToggleSideNav: EventEmitter<any> = new EventEmitter();
  constructor(
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private publicService: PublicService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.menuList = [{
      id: 'dashboard',
      text: this.publicService?.translateTextFromJson('dashboard.sideMenu.dashboard'),
      // icon: 'fa-grip-horizontal',
      routerLink: '/dashboard',
      state: false
    },
    {
      id: 'tanks',
      text: this.publicService?.translateTextFromJson('dashboard.sideMenu.tanks'),
      icon: 'fa-house-user',
      routerLink: '/dashboard/tanks',
      state: false
    },
    {
      id: 'driver',
      text: this.publicService?.translateTextFromJson('dashboard.sideMenu.driver'),
      icon: 'fa-car-rear',
      routerLink: '/dashboard/drivers',
      state: false
    },
    {
      id: 'supervisors',
      text: this.publicService?.translateTextFromJson('dashboard.sideMenu.supervisors'),
      icon: 'fa-people-roof',
      routerLink: '/dashboard/supervisors',
      state: false
    },
    {
      id: 'orders',
      text: this.publicService?.translateTextFromJson('dashboard.sideMenu.orders'),
      icon: 'fa-file-pen',
      routerLink: '/dashboard/orders',
      state: false,
    },
    {
      id: 'users',
      text: this.publicService?.translateTextFromJson('dashboard.sideMenu.users'),
      icon: 'fa-users',
      routerLink: '/dashboard/users',
      state: false,
    },
    ]

    this.screenWidth = window?.innerWidth;
    this.sharedService?.showSideMenu?.subscribe((res: any) => {
      this.showSideMenu = res;
    })

    let itemId = window?.localStorage?.getItem(keys?.lastRoute);
    this.menuList.forEach((ele: any) => {
      if (ele.id == itemId)
        ele.state = true;
      // ele.state=false
    });
  }

  handelClick(item: any) {
    console.log(item?.id);
    localStorage?.setItem(keys?.lastRoute, item.id)
    this.menuList?.forEach((ele: any) => {
      ele.state = ele.state;
      // ele.state = false
    });
    // item.state = true
    item.state = !item?.state;
    console.log(item.state);

    // let index=this.menuList[item];
    //     // index.state = !index.state;
    //     index.state=true
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav?.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    this.rotate();
    this.show = !this.show
  }

  toggleIcon(): void {
    this.collapsed = true
    this.onToggleSideNav?.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    this.show = !this.show;
  }

  rotate(): void {
    this.rotated = !this.rotated;
  }

  logout(): void {
    this.confirmationService?.confirm({
      message: 'Are you sure you want logout?',
      header: 'Logout',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.router?.navigate(['/auth']);
        localStorage?.clear();
      }
    });

  }
}
