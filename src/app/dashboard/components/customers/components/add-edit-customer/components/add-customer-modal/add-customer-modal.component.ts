import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { setOrRemoveCacheRequestURL } from 'src/app/common/interceptors/caching/caching.utils';
import { environment } from 'src/environments/environment';
import { roots } from 'src/app/shared/configs/endPoints';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AlertsService } from 'src/app/core/services/alerts/alerts.service';
import { CustomersService } from 'src/app/dashboard/services/customers.service';
import { patterns } from 'src/app/shared/configs/patternValidations';
import { CheckValidityService } from 'src/app/shared/services/check-validity/check-validity.service';
import { PublicService } from 'src/app/shared/services/public.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { EditServiceService } from 'src/app/core/services/lists/edit-service.service';

@Component({
  selector: 'app-add-customer-modal',
  standalone: true,
  imports: [CommonModule,TranslateModule,FormsModule,ReactiveFormsModule,InputSwitchModule],
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.scss']
})
export class AddCustomerModalComponent implements OnInit {
  private unsubscribe: Subscription[] = [];

  modalData: any;
  isEdit: boolean = false;
  customerId: any;

  constructor(
    public checkValidityService: CheckValidityService,
    private customersService: CustomersService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    public fb: FormBuilder,
    private editService: EditServiceService
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    if (this.modalData?.item?.id) {
      this.customerId = this.modalData?.item?.id;
    }
    this.isEdit = this.modalData?.type == 'edit' ? true : false;
    if (this.isEdit) {
      this.patchValue();
    }
  }

  modalForm = this.fb?.group(
    {
      isVip: [false, []],
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)]
      }],
      mobileNumber: ['', {
        validators: [
          Validators.required, Validators.pattern(patterns?.phone)], updateOn: "blur"
      }]
    }, { updateOn: "blur" }
  );

  get formControls(): any {
    return this.modalForm?.controls;
  }
  patchValue(): void {
    this.modalForm?.patchValue({
      name: this.modalData?.item?.name,
      mobileNumber: this.modalData?.item?.mobileNumber,
      isVip: this.modalData?.item?.isVip,
    });
  }

  submit(): void {
    if (this.modalForm.valid) {
      const payload = {
        name: this.modalForm.value.name,
        mobileNumber: this.modalForm.value.mobileNumber,
        isVip: this.modalForm.value.isVip,
        ...(this.isEdit && { id: this.customerId }),
      };

      this.publicService.show_loader.next(true);
      this.customersService.addOrUpdateCustomer(payload, this.customerId ?? null)
        .pipe(
          tap((res: any) => {
            if (res?.isSuccess && res?.statusCode === 200) {
              setOrRemoveCacheRequestURL(
                `${environment.apiUrl}/${roots.dashboard.customers.customersShortList}`,
                'Remove'
              );
              setOrRemoveCacheRequestURL(
                `${environment.apiUrl}/${roots.dashboard.customers.customersList}`,
                'Remove',
                { page: 1, per_page: 30 }
              );
              this.editService.emitRefreshUsers();

              this.ref.close({ listChanged: true, item: res.data });
              this.alertsService.openSweetAlert('success', res.message);
            } else {
              this.alertsService.openSweetAlert('info', res.message);
            }
          }),
          catchError((error) => {
            this.alertsService.openSweetAlert('error', error?.message || 'An error occurred');
            throw error;
          }),
          finalize(() => this.publicService.show_loader.next(false))
        )
        .subscribe();
    } else {
      this.checkValidityService.validateAllFormFields(this.modalForm);
    }
  }


  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}