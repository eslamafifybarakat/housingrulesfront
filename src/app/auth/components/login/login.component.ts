import { TranslationService } from './../../../shared/services/i18n/translation.service';
import { keys } from './../../../shared/configs/localstorage-key';
import { AppRoutes } from './../../../shared/configs/routes';
import { patterns } from './../../../shared/configs/patternValidations';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicService } from './../../../shared/services/public.service';
import { AlertsService } from './../../../core/services/alerts/alerts.service';
import { CheckValidityService } from './../../../shared/services/check-validity/check-validity.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthUserService } from '../../services/auth-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  currentLanguage: any;

  constructor(
    public checkValidityService: CheckValidityService,
    public translationService: TranslationService,
    private authUserService: AuthUserService,
    public alertsService: AlertsService,
    public publicService: PublicService,
    private cdr: ChangeDetectorRef,
    protected router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.currentLanguage = window?.localStorage?.getItem(keys?.language);
  }

  loginForm = this.fb?.group(
    {
      email: ['', {
        validators: [
          Validators.required,
          Validators.pattern(patterns?.userName || patterns?.email),
          Validators?.minLength(3)], updateOn: "blur"
      }],
      password: ['', {
        validators: [
          Validators.required,
          Validators.pattern(patterns?.password)
        ], updateOn: "blur"
      }],
      remember: [false, []]
    }
  );

  get formControls(): any {
    return this.loginForm?.controls;
  }

  getCurrentUserData(): void {
    this.authUserService?.getUserData()?.subscribe((res: any) => {
      // this.authUserService?.saveUserData(res);
    })
  }

  forgetPassWord(): void {
    this.router?.navigateByUrl(`auth/${AppRoutes?.auth?.forgetPassword}`);
  }

  submit(): void {
    if (this.loginForm?.valid) {
      this.publicService?.show_loader?.next(true);
      let data = {
        userNameOrEmailAddress: this.loginForm?.value?.email,
        password: this.loginForm?.value?.password,
        rememberClient: true
      };
      setTimeout(() => {
        this.router?.navigateByUrl('/dashboard');
        this.publicService?.show_loader?.next(false);
        console.log(this.loginForm?.value);

      }, 1000);
      // this.authUserService?.login(data)?.subscribe(
      //   (res: any) => {
      //     if (res?.success == true) {
      //       this.publicService?.show_loader?.next(false);
      //       this.loginForm?.reset();
      //       this.authUserService?.getUserData()?.subscribe(
      //         (res: any) => {
      //           if (res?.success == true) {
      //             this.publicService?.show_loader?.next(false);
      //           } else {
      //             this.publicService?.show_loader?.next(false);
      //             res?.error?.message ? this.alertsService?.openSweetAlert('error', res?.error?.message) : '';
      //           }
      //         },
      //         (err: any) => {
      //           err ? this.alertsService?.openSweetAlert('error', err) : '';
      //           this.publicService?.show_loader?.next(false);
      //         });
      //     } else {
      //       this.publicService?.show_loader?.next(false);
      //       res?.error?.message ? this.alertsService?.openSweetAlert('error', res?.error?.message) : '';
      //     }
      //   },
      //   (err: any) => {
      //     err ? this.alertsService?.openSweetAlert('error', err) : '';
      //     this.publicService?.show_loader?.next(false);
      //   }
      // );
    } else {
      this.publicService?.show_loader?.next(false);
      this.checkValidityService?.validateAllFormFields(this.loginForm);
    }
    this.cdr?.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.forEach((sb) => sb?.unsubscribe());
  }
}

