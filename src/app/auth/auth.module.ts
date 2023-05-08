import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class AuthModule { }
