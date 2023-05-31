import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Validators, AbstractControl } from '@angular/forms';
import { keys } from '../configs/localstorage-key';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  apiUrl = environment?.apiUrl;
  userInfo = JSON?.parse(window?.localStorage?.getItem(keys?.userData) || '{}');
  headers = new HttpHeaders()?.set('Content-Type', 'application/json');

  //End Home Page Loading
  endGetAllProductLoading = new BehaviorSubject<boolean>(false);
  endGetFamousArticlesLoading = new BehaviorSubject<boolean>(false);

  pushUrlData = new BehaviorSubject<boolean>(false);
  messageSent = new BehaviorSubject<boolean>(false);
  homeRouteData = new BehaviorSubject<{}>({});
  notificationAlert = new BehaviorSubject<{}>({});
  notificationId = new BehaviorSubject<{}>({});
  toggleAsideMenu = new BehaviorSubject<boolean>(false);
  countdown = new BehaviorSubject<boolean>(false);

  article_Tab = new BehaviorSubject<{}>({});
  recallSearchResults = new BehaviorSubject<{}>({});
  recallNotificationsAlerts = new BehaviorSubject<{}>({});
  recallSettingsBank = new BehaviorSubject<{}>({});
  show_loader = new Subject<boolean>();

  showSideMenu = new BehaviorSubject<boolean>(false);
  changePageSub = new BehaviorSubject<{}>({});

  alphabet: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  constructor(
    private translate: TranslateService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.toggleAsideMenu?.next(true);
  }

  base64ToImageFile(data: any, filename: any) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename + '.' + mime.substr(6), { type: mime });
  }
  translateTextFromJson(text: string): any {
    return this.translate.instant(text);
  }
  downloadExampleFn(urlRoot: any): Observable<Blob> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'blob' as 'json'
    };
    return this.http.get<any>(`${this.apiUrl}/${urlRoot}`, httpOptions);
  }
  downloadExample(url: any): void {
    window.open(environment?.apiUrl + '/' + url);
  }
  returnArryElementIds(elements: any): any {
    let ids: any = [];
    elements?.forEach((elment: any) => {
      ids?.push(elment?.id);
    });
    return ids;
  }
  returnArryElementsObjects(arrIds: any, list: any): any {
    let finalArr: any = [];
    arrIds?.forEach((id: any) => {
      list?.forEach((item: any) => {
        if (id == item?.id) {
          finalArr?.push(item);
        }
      });
    });
    return finalArr;
  }

  getLetter(index: any): any {
    return this.alphabet[index];
  }

  clearValidationErrors(control: AbstractControl): void {
    control.markAsPending();
  }
  addValidators(form: any, controls: string[], pattern?: any): any {
    controls.forEach(c => {
      form.get(c)?.setValidators([Validators.required, Validators.pattern(pattern)]);
      form.get(c)?.updateValueAndValidity();
    });
  }
  removeValidators(form: any, controls: string[], pattern?: any): any {
    controls.forEach(c => {
      form.get(c)?.clearValidators();
      form.get(c)?.updateValueAndValidity();
    });
  }

  getDriverStatus(): any {
    let arr = [
      { id: 1, value: 'available', name: this.translateTextFromJson('general.available'), class: "success" },
      {
        id: 2, value: 'busy', name: this.translateTextFromJson('general.busy'), class:
          "danger"
      },
      { id: 3, value: 'far', name: this.translateTextFromJson('general.far'), class: "warning" },
    ];
    return arr;
  }
  getIsWorking(): any {
    let arr = [
      { id: 1, value: 'available', name: this.translateTextFromJson('general.available'), class: "success" },
      {
        id: 2, value: 'busy', name: this.translateTextFromJson('general.notAvailable'), class: "danger"
      }
    ];
    return arr;
  }
  getDistricts(): any {
    let arr = [
      { id: 1, value: 1, name: "جيزان" }
    ];
    return arr;
  }
  getOrderStatus(): any {
    let arr = [
      { id: 1, value: 'pending', name: this.translateTextFromJson('general.pending'), class: "warning" },
      { id: 2, value: 'assignedToDriver', name: this.translateTextFromJson('general.assignedToDriver'), class: "primary" },
      { id: 3, value: 'driverOnWayToCustomer', name: this.translateTextFromJson('general.driverOnWayToCustomer'), class: "gray" },
      { id: 4, value: 'driverArrivedToCustomer', name: this.translateTextFromJson('general.driverArrivedToCustomer'), class: "cyan" },
      { id: 5, value: 'driverArrivedToStation', name: this.translateTextFromJson('general.driverArrivedToStation'), class: "purple" },
      { id: 6, value: 'completed', name: this.translateTextFromJson('general.completed'), class: "success" },
      { id: 7, value: 'cancelled', name: this.translateTextFromJson('general.cancelled'), class: "danger" },

    ];
    return arr;
  }

  getPropertyType(): any {
    let arr: any = [
      { id: 1, value: 1, name: this.translateTextFromJson('general.Residential') },
      { id: 2, value: 2, name: this.translateTextFromJson('general.Governmental') },
      { id: 3, value: 3, name: this.translateTextFromJson('general.Commercial') },
    ];
    return arr;
  }

  getOrderOrigin(): any {
    let orderOriginList: any = [
      { id: 1, value: 1, name: this.translateTextFromJson('general.byWhatsApp') },
      { id: 2, value: 2, name: this.translateTextFromJson('general.byTMS') },
      { id: 3, value: 3, name: this.translateTextFromJson('general.byCall') },
      { id: 4, value: 4, name: this.translateTextFromJson('general.bySite') },
      { id: 5, value: 5, name: this.translateTextFromJson('general.others') },
    ]
    return orderOriginList;
  }

  getPaymentMethods(): any {
    let paymentMethodsList: any = [
      { id: 1, value: 1, name: "Cash" },
      { id: 2, value: 2, name: "Mada" },
      { id: 3, value: 3, name: "Transfer" },
      { id: 4, value: 4, name: "Credit" }
    ]
    return paymentMethodsList;
  }

  getUserTypes(): any {
    let arr: any = [
      { id: 1, value: 1, name: this.translateTextFromJson('dashboard.users.userTypes.superAdmin') },
      { id: 2, value: 2, name: this.translateTextFromJson('dashboard.users.userTypes.admin') },
      { id: 3, value: 3, name: this.translateTextFromJson('dashboard.users.userTypes.customerServicesSupervisor') },
      { id: 4, value: 4, name: this.translateTextFromJson('dashboard.users.userTypes.customerService') },
      { id: 5, value: 5, name: this.translateTextFromJson('dashboard.users.userTypes.driversSupervisor') },
      { id: 6, value: 6, name: this.translateTextFromJson('dashboard.users.userTypes.driver') },
      { id: 7, value: 7, name: this.translateTextFromJson('dashboard.users.userTypes.gateIn') },
      { id: 8, value: 8, name: this.translateTextFromJson('dashboard.users.userTypes.gateOut') },
      { id: 9, value: 9, name: this.translateTextFromJson('dashboard.users.userTypes.accountant') }
    ]
    return arr;
  }
  getTanksSizes(): any {
    let arr: any = [
      { value: 1, name: this.translateTextFromJson('dashboard.tanks.TankSize.Size15') },
      { value: 2, name: this.translateTextFromJson('dashboard.tanks.TankSize.Size20') },
      { value: 3, name: this.translateTextFromJson('dashboard.tanks.TankSize.Size32') }]

    return arr;
  }

  getOrdersCancellationReasons(): any {
    let arr: any = [
      { id: 1, value: 1, name: this.translateTextFromJson('dashboard.orders.reasons.Inquiry') },
      { id: 2, value: 2, name: this.translateTextFromJson('dashboard.orders.reasons.PriceIssue') },
      { id: 3, value: 3, name: this.translateTextFromJson('dashboard.orders.reasons.UncoveredLocation') },
      { id: 4, value: 4, name: this.translateTextFromJson('dashboard.orders.reasons.CustomerCancelation') },
      { id: 5, value: 5, name: this.translateTextFromJson('dashboard.orders.reasons.OrderDuplicate') },
      { id: 100, value: 100, name: this.translateTextFromJson('dashboard.orders.reasons.other') },
    ];
    return arr;
  }
}
