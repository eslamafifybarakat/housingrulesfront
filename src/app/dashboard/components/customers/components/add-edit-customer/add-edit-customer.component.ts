// import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
// import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
// import { PublicService } from './../../../../../shared/services/public.service';
// // import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { patterns } from './../../../../../shared/configs/patternValidations';
// import { CustomersService } from './../../../../services/customers.service';
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { Validators, FormBuilder } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { setOrRemoveCacheRequestURL } from 'src/app/common/interceptors/caching/caching.utils';
// import { environment } from 'src/environments/environment.prod';
// import { roots } from 'src/app/shared/configs/endPoints';
// @Component({
//   selector: 'app-add-edit-customer',
//   templateUrl: './add-edit-customer.component.html',
//   styleUrls: ['./add-edit-customer.component.scss']
// })
// export class AddEditCustomerComponent implements OnInit {
//   private unsubscribe: Subscription[] = [];

//   modalData: any;
//   isEdit: boolean = false;
//   customerId: any;

//   constructor(
//     public checkValidityService: CheckValidityService,
//     private customersService: CustomersService,
//     public alertsService: AlertsService,
//     public publicService: PublicService,
//     // private config: DynamicDialogConfig,
//     private cdr: ChangeDetectorRef,
//     // private ref: DynamicDialogRef,
//     protected router: Router,
//     public fb: FormBuilder,
//   ) { }

//   ngOnInit(): void {
//     // this.modalData = this.config?.data;
//     if (this.modalData?.item?.id) {
//       this.customerId = this.modalData?.item?.id;
//     }
//     this.isEdit = this.modalData?.type == 'edit' ? true : false;
//     if (this.isEdit) {
//       this.patchValue();
//     }
//   }

//   modalForm = this.fb?.group(
//     {
//       isVip: [false, []],
//       name: ['', {
//         validators: [
//           Validators.required,
//           Validators?.minLength(3)]
//       }],
//       mobileNumber: ['', {
//         validators: [
//           Validators.required, Validators.pattern(patterns?.phone)], updateOn: "blur"
//       }]
//     }, { updateOn: "blur" }
//   );

//   get formControls(): any {
//     return this.modalForm?.controls;
//   }
//   patchValue(): void {
//     this.modalForm?.patchValue({
//       name: this.modalData?.item?.name,
//       mobileNumber: this.modalData?.item?.mobileNumber,
//       isVip: this.modalData?.item?.isVip,
//     })
//     console.log(this.modalData);
//   }

//   submit(): void {
//     const myObject: { [key: string]: any } = {};
//     if (this.modalForm?.valid) {
//       myObject['name'] = this.modalForm?.value?.name;
//       myObject['mobileNumber'] = this.modalForm?.value?.mobileNumber;
//       myObject['isVip'] = this.modalForm?.value?.isVip;
//       if (this.isEdit) {
//         myObject['id'] = this.customerId;
//         // myObject['lastModifiedBy'] = 0;
//       } else {
//         // myObject['createBy'] = 0;
//       }
//       this.publicService?.show_loader?.next(true);
//       this.customersService?.addOrUpdateCustomer(myObject, this.customerId ? this.customerId : null)?.subscribe(
//         (res: any) => {
//           setOrRemoveCacheRequestURL(`${environment?.apiUrl}/${roots?.dashboard?.customers?.customersShortList}`,'Remove')

//           if (res?.isSuccess == true && res?.statusCode == 200) {
//             // this.ref.close({ listChanged: true, item: res?.data });
//             this.publicService?.show_loader?.next(false);
//             res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
//           } else {
//             res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
//             this.publicService?.show_loader?.next(false);
//           }
//         },
//         (err: any) => {
//           err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
//           this.publicService?.show_loader?.next(false);
//         });
//     } else {
//       this.checkValidityService?.validateAllFormFields(this.modalForm);
//     }
//     console.log(this.modalData);

//   }

//   cancel(): void {
//     // this.ref?.close({ listChanged: false });
//   }
//   ngOnDestroy(): void {
//     this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
//   }
// }
import { CheckValidityService } from './../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../shared/services/public.service';
import {  DialogService } from 'primeng/dynamicdialog';
import { patterns } from './../../../../../shared/configs/patternValidations';
import { CustomersService } from './../../../../services/customers.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddEditAddressedPlacesComponent } from './components/add-edit-addressed-places/add-edit-addressed-places.component';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import { AddressDetailsComponent } from './components/add-edit-addressed-places/address-details/address-details.component';
import { AddressedPlacesService } from 'src/app/dashboard/services/addressed-places.service';
import { keys } from 'src/app/shared/configs/localstorage-key';
@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrls: ['./add-edit-customer.component.scss']
})
export class AddEditCustomerComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  customerData: any;
  isEdit: boolean = false;
  customerId: any;
  propertyTypeList: any = [];
  isLoadingPropertyType: boolean = false;

  loadingIndicator: boolean = false;
  addressesList: any = [];
  addressesCount: number = 0;
  tableHeaders: any = [];
  currentLanguage: any;


  page: number = 1;
  perPage: number = 30;
  pagesCount: number = 0;
  rowsOptions: number[] = [5, 10, 15, 30];
  enableSortFilter: boolean = true;
  isLoadingSearch: boolean = false;
  isSearch: boolean = false;
  searchKeyword: any = null;
  filtersArray: any = [];
  sortObj: any = {};
  placeTypeMapping: { [key: number]: { en: string; ar: string } } |any = {
    1: { en: 'Home', ar: 'المنزل' },
    2: { en: 'Work', ar: 'العمل' },
  };
  
  constructor(
    public checkValidityService: CheckValidityService,
    private customersService: CustomersService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    protected router: Router,
    public fb: FormBuilder,
    private addressedPlacesService:AddressedPlacesService
  ) { 
    this.currentLanguage = window?.localStorage?.getItem(keys?.language);
  }

  ngOnInit(): void {
    this.propertyTypeList = this.publicService.getPropertyType();
    this.customerId = +this.activatedRoute?.snapshot?.params?.['id'];
    if (this.customerId) {
      this.isEdit = true;
      this.getCustomerById(this.customerId);
      this.getAddressById(this.customerId)
    }
    this.tableHeaders = [
      { field: 'address', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.address'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.address'), sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, type: 'text' },
      { field: 'addressTag', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.addressTag'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.addressTag'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', },
      { field: 'locationLink', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.locationLink'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', enableItemLink: true, typeViewModal: 'location' },
      { field: 'nationalAddress', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.nationalAddress'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.nationalAddress'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', },
      { field: 'placeType', header: this.publicService?.translateTextFromJson('dashboard.tableHeader.placeType'), title: this.publicService?.translateTextFromJson('dashboard.tableHeader.placeType'), sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, type: 'text', },
      
    ];
  }

  modalForm = this.fb?.group(
    {
      isVip: [false, []],
      phoneWup: [false, []],
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)],
        updateOn: "blur"
      },],
      mobileNumber: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.phone)], updateOn: "blur"
      }],
    }
  );

  get formControls(): any {
    return this.modalForm?.controls;
  }
  patchValue(): void {
    this.modalForm?.patchValue({
      name: this.customerData?.name,
      mobileNumber: this.customerData?.mobileNumber,
      isVip: this.customerData?.isVip,
    })

    // this.propertyTypeList?.forEach((item: any) => {
    //   if (item?.id == this.customerData?.propertyType) {
    //     this.modalForm?.patchValue({
    //       propertyType: item,
    //     })
    //   }
    // });
  }
  getCustomerById(id: any, isActive?: boolean) {
    isActive == false ? '' : this.publicService?.show_loader?.next(true);
    this.customersService?.getCustomerById(id)?.subscribe(
      (res: any) => {
        if (res?.isSuccess == true && res?.statusCode == 200) {
          this.customerData = res.data;
          this.patchValue();    
          // this.addressesList = res.data?.addressedPlaces;
          // this.addressesCount = res.data?.addressedPlaces?.length;
          this.publicService?.show_loader?.next(false);
        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.publicService?.show_loader?.next(false);
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.publicService?.show_loader?.next(false);
      });
  }
  getAddressById(id: any, isActive?: boolean) {
    isActive == false ? '' : this.publicService?.show_loader?.next(true);
    this.addressedPlacesService.getAllAddressByCustomerId(id)?.subscribe(
      (res: any) => {
        if (res?.isSuccess == true && res?.statusCode == 200) {
          this.addressesList = res.data;
          console.log(this.addressesList); // للتحقق من القيمة الحالية
          this.addressesList.forEach((item: any) => {
            if (item['placeType'] in this.placeTypeMapping) {
              item['placeType'] = this.placeTypeMapping[item['placeType']][this.currentLanguage];
            }
          });
          this.addressesCount = res.data?.length;

        } else {
          res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
          this.publicService?.show_loader?.next(false);
        }
      },
      (err: any) => {
        err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
        this.publicService?.show_loader?.next(false);
      });
  }
  
  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      myObject['name'] = this.modalForm?.value?.name;
      myObject['mobileNumber'] = this.modalForm?.value?.mobileNumber;
      myObject['isVip'] = this.modalForm?.value?.isVip;
      myObject['phoneWup'] = this.modalForm?.value?.phoneWup;
      // myObject['propertyType'] = this.modalForm?.value?.propertyType?.['id'];

      if (this.isEdit) {
        myObject['id'] = this.customerId;
        // myObject['lastModifiedBy'] = 0;
      } else {
        // myObject['createBy'] = 0;
      }
      this.publicService?.show_loader?.next(true);
      this.customersService?.addOrUpdateCustomer(myObject, this.customerId ? this.customerId : null)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true && res?.statusCode == 200) {
            if(!this.isEdit){
            this.router?.navigate(['/dashboard/customers']);
          }
            this.publicService?.show_loader?.next(false);
            res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
          } else {
            res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
            this.publicService?.show_loader?.next(false);
          }
        },
        (err: any) => {
          err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
          this.publicService?.show_loader?.next(false);
        });
    } else {
      this.checkValidityService?.validateAllFormFields(this.modalForm);
    }
  }

  cancel(): void {
    this.router?.navigate(['/dashboard/customers']);
  }
  itemDetails(item?: any): void {
    const ref = this.dialogService?.open(AddressDetailsComponent, {
      data: item,
      header: this.publicService?.translateTextFromJson('dashboard.addresses.addressDetails'),
      dismissableMask: true,
      width: '40%',
      styleClass: 'custom_modal'
    });
  }
  addOrEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditAddressedPlacesComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add',
        customerId: this.customerId,
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.addresses.editAddress') : this.publicService?.translateTextFromJson('dashboard.addresses.addAddress'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom_modal'
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getAddressById(this.customerId, false);
      }
    });
  }
  deleteItem(item: any): void {
    if (item?.confirmed) {
      this.publicService?.show_loader.next(true);
      const myObject: { [key: string]: any } = {};
        myObject['deleteBy'] = 0;
        myObject['id'] = item.item.id;
      this.addressedPlacesService?.deleteAddress(myObject).subscribe(
        (res: any) => {
          if (res?.isSuccess == true && res?.statusCode == 200) {
            res?.message ? this.alertsService?.openSweetAlert('success', res?.message) : '';
            this.publicService?.show_loader?.next(false);
            this.getAddressById(this.customerId, false);
          } else {
            res?.message ? this.alertsService?.openSweetAlert('info', res?.message) : '';
            this.publicService?.show_loader?.next(false);
          }
        },
        (err) => {
          err?.message ? this.alertsService?.openSweetAlert('error', err?.message) : '';
          this.publicService?.show_loader?.next(false);
        });
    }
  }  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
