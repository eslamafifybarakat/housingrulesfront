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
  menuList: any = menuList;

  currentLanguage: string = 'en';

  @Output() onToggleSideNav: EventEmitter<any> = new EventEmitter();
  constructor(
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private router: Router,
  ) { }

  ngOnInit(): void {
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
