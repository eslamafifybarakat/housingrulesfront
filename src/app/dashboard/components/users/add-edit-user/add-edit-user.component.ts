import { PublicService } from './../../../../shared/services/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmPasswordValidator } from './../../../../shared/configs/confirm-password-validator';
import { patterns } from './../../../../shared/configs/patternValidations';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertsService } from './../../../../core/services/alerts/alerts.service';
import { AuthUserService } from './../../../../auth/services/auth-user.service';
import { CheckValidityService } from './../../../../shared/services/check-validity/check-validity.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  checked: boolean = false;
  modalData: any;
  isEdit: boolean = false;

  constructor(
    public checkValidityService: CheckValidityService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    protected router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.modalData = this.config?.data;
    this.isEdit = this.modalData?.type == 'edit' ? true : false;
    if (this.isEdit) {
      this.patchValue();
    }
  }

  userForm = this.fb?.group(
    {
      email: ['', {
        validators: [
          Validators.required,
          Validators.pattern(patterns?.userName || patterns?.email),
          Validators?.minLength(3)], updateOn: "blur"
      }],
      // password: ['', {
      //   validators: [
      //     Validators.required,
      //     Validators.pattern(patterns?.password)
      //   ], updateOn: "blur"
      // }],
      newpassword: ['', {
        validators: [
          Validators.required,
          Validators.pattern(patterns?.password)
        ],
        updateOn: 'blur'
      }],
      confirmpassword: ['', {
        validators: [
          Validators.required,
          Validators.pattern(patterns?.password)
        ],
        updateOn: 'blur'
      }],
      active: [, []]
    },
    {
      validator: ConfirmPasswordValidator.MatchPassword
    }
  );

  get formControls(): any {
    return this.userForm?.controls;
  }
  patchValue(): void {
    this.userForm?.patchValue({
      email: 'Ahmed44@gmail.com',
      newpassword: '67gg88',
      confirmpassword: '67gg88',
      active: true
    })
  }

  submit(): void {
    if (this.userForm?.valid) {
      this.publicService?.show_loader?.next(true);
      let data = {
        userNameOrEmailAddress: this.userForm?.value?.email,
        password: this.userForm?.value?.password,
        rememberClient: true
      };
      setTimeout(() => {
        this.publicService?.show_loader?.next(false);
        console.log(this.userForm?.value);
        this.ref?.close({});
      }, 1000);

    } else {
      this.publicService?.show_loader?.next(false);
      this.checkValidityService?.validateAllFormFields(this.userForm);
    }
    this.cdr?.detectChanges();
  }
  cancel(): void {
    this.ref?.close({});
  }
  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}
