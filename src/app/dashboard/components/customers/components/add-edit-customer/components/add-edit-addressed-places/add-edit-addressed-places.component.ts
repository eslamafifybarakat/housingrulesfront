import { CheckValidityService } from './../../../../../../../shared/services/check-validity/check-validity.service';
import { AlertsService } from './../../../../../../../core/services/alerts/alerts.service';
import { PublicService } from './../../../../../../../shared/services/public.service';
import { patterns } from './../../../../../../../shared/configs/patternValidations';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddressedPlacesService } from 'src/app/dashboard/services/addressed-places.service';
import { PlaceType } from 'src/app/enums';
import { keys } from 'src/app/shared/configs/localstorage-key';

@Component({
  selector: 'app-add-edit-addressed-places',
  templateUrl: './add-edit-addressed-places.component.html',
  styleUrls: ['./add-edit-addressed-places.component.scss']
})
export class AddEditAddressedPlacesComponent implements OnInit {
  isEdit: boolean = false;
  customerId: any;
  addressId: any;
  modalData: any;
  currentLanguage:any;
  placeTypes:any;
  phone:any;

  constructor(
    private addressedPlacesService: AddressedPlacesService,
    private checkValidityService: CheckValidityService,
    public publicService: PublicService,
    private alertsService: AlertsService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) { 
    this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    this.placeTypes = [
      {
        label: this.currentLanguage === 'ar' ? 'المنزل' : 'Home', 
        value: PlaceType.Home 
      },
      {
        label: this.currentLanguage === 'ar' ? 'العمل' : 'Work', 
        value: PlaceType.Work 
      }
    ];
  }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.customerId = +this.modalData?.customerId;
    this.addressId = +this.modalData?.item?.id;
    this.phone=this.modalData?.phone;
    if (this.addressId) {
      this.isEdit = true;
      this.patchValue();
    }
  }
  modalForm = this.fb?.group(
    {
      isDefault: [false,[]],
      locationLink: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.url)], updateOn: "blur"
      }],
      nationalAddress: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)],
        updateOn: "blur"
      },],
      address: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)],
        updateOn: "blur"
      },],
      addressTag: ['', {
        validators: [
          Validators.required
        ], updateOn: "blur"
      }],
      placeType: [null, [Validators.required]] 
    }
  );

  patchValue(): void {
    this.modalForm?.patchValue({
      address: this.modalData?.item?.address,
      nationalAddress: this.modalData?.item?.nationalAddress,
      addressTag: this.modalData?.item?.addressTag,
      locationLink: this.modalData?.item?.locationLink,
      isDefault:this.modalData?.isDefault,
      placeType: this.modalData?.item?.placeType
    })
  }
  get formControls(): any {
    return this.modalForm?.controls;
  }
  submit(): void {
    const myObject: { [key: string]: any } = {};
    if (this.modalForm?.valid) {
      if (this.isEdit) {
        myObject['id'] = this.addressId;
      } else {
        myObject['customerId'] = this.customerId;
      }

      myObject['addressTag'] = this.modalForm?.value?.addressTag;
      myObject['address'] = this.modalForm?.value?.address;
      myObject['nationalAddress'] = this.modalForm?.value?.nationalAddress;
      myObject['locationLink'] = this.modalForm?.value?.locationLink;
      myObject['isDefualt'] = this.modalForm?.value?.isDefault;
      myObject['placeType'] = this.modalForm?.value?.placeType;
      
      this.publicService?.show_loader?.next(true);
      this.addressedPlacesService?.addOrUpdateAddress(myObject, this.addressId ? this.addressId : null)?.subscribe(
        (res: any) => {
          if (res?.isSuccess == true && res?.statusCode == 200) {
            this.publicService?.show_loader?.next(false);
            this.ref?.close({ listChanged: true, id: res?.data?.id });
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
    this.ref?.close();
  }
}
