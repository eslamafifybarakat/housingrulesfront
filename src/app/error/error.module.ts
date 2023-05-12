import { Error404Component } from './components/error404/error404.component';
import { Error500Component } from './components/error500/error500.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ErrorComponent,
    Error404Component,
    Error500Component
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    SharedModule
  ]
})
export class ErrorModule { }
