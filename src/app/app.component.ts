import { AlertsService } from './core/services/alerts/alerts.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ThemeService } from './core/services/themes/theme.service';
import { SharedService } from './shared/services/shared.service';
import { OnlineStatusType } from 'ngx-online-status/public_api';
import { keys } from './shared/configs/localstorage-key';
import { OnlineStatusService } from 'ngx-online-status';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Component } from '@angular/core';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'title';
  languages: any = ["en", "ar"];
  browserLang: any;
  currentTheme: any = '';
  url: any = {};

  constructor(
    private onlineStatusService: OnlineStatusService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private alertsService: AlertsService,
    private themeService: ThemeService,
    private config: PrimeNGConfig,
    private router: Router,

  ) {
    this.translateService?.addLangs(this.languages);
    const currentLang = window.localStorage.getItem(keys.language);
    this.translateService.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
    if (currentLang !== null && currentLang !== undefined) {
      this.translateService?.use(currentLang);
      let direction = localStorage.getItem(keys?.language) === "ar"
        ? "rtl"
        : "ltr";
      document.documentElement.dir = direction;
      document.documentElement.lang = currentLang;

      let getMain = document?.getElementsByTagName("html")[0];
      getMain?.setAttribute("lang", currentLang);
      getMain?.setAttribute("class", currentLang);
    } else {
      this.browserLang = this.translateService?.getBrowserLang();
      window.localStorage.setItem(keys.language, this.browserLang);
      this.translateService?.use(this.browserLang);
      this.translateService?.setDefaultLang(this.browserLang);
      window.location.reload();
    }
  }
  ngOnInit(): void {
    let data = this.activatedRoute.snapshot.data;
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (child.snapshot.data) {
              return child.snapshot.data;
            } else {
              return null;
            }
          }
          return null;
        })
      )
      .subscribe((data: any) => {
        if (data) {
          this.sharedService.urlData.next(data)
          this.url = data;
        }
      });

    this.currentTheme = window.localStorage.getItem(keys?.theme);
    if (this.currentTheme == 'light') {
      this.themeService.setLightTheme();
    }
    if (this.currentTheme == 'dark') {
      this.themeService.setDarkTheme();
    } else {
      this.themeService.setLightTheme();
    }

    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      status ? this.alertsService?.openSnackBar(`your internet connection was  restored`, 2000, 'center', 'bottom')
        : this.alertsService?.openSnackBar(`you are currently offline`, 2000, 'center', 'bottom')
    });
  }

}
