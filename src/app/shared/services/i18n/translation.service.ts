import { Subscription } from 'rxjs';
// import { PrimeNGConfig } from 'primeng/api';
import { keys } from './../../configs/localstorage-key';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang: any;
  localeEvent = new Subject<string>();
  subscription!: Subscription;
  constructor(
    public translateService: TranslateService,

  ) { }

  /**
  * Change language
  */
  changeLang(lang: string): void {
    this.currentLang = window.localStorage.getItem(keys.language);
    // let dir: any = this.bankSetting?.dir;
    // let locale: any = this.bankSetting?.locale;

    if (this.currentLang !== lang) {
      localStorage.setItem(keys.language, lang);
      window.location.reload();
    }
    setTimeout(() => {
      // this.bankSetting = JSON.parse(window.localStorage.getItem(keys.siteSettings) || '{}');
      this.translateService.use(lang);


      this.localeEvent.next(lang);
      let direction: any = window.localStorage.getItem(keys.language) === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = direction;
      document.documentElement.lang = this.currentLang;

      let getMain = document.getElementsByTagName("html")[0];
      getMain.setAttribute("lang", this.currentLang);
      getMain.setAttribute("class", this.currentLang);
    }, 1000);
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    return (localStorage.getItem(keys.language) || this.translateService.getDefaultLang());
  }
}
