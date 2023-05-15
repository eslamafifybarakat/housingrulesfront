import { DynamicTableComponent } from './dynamic/components/dynamic-table/dynamic-table.component';
import { NoInternetComponent } from './componenets/no-internet/no-internet.component';
import { HttpInterceptorService } from './interceptors/http-interceptor.service';
import { HttpErrorInterceptor } from './interceptors/error-interceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DynamicTableLocalActionsComponent } from './dynamic/components/dynamic-table-local-actions/dynamic-table-local-actions.component';

let coreComponents = [
  DynamicTableComponent,
  DynamicTableLocalActionsComponent
];

@NgModule({
  declarations: [
    NoInternetComponent,
    ...coreComponents,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ],
  exports: [
    ...coreComponents
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
  ],
})

export class CoreModule { }
