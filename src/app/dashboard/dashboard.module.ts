import { AsideMenuComponent } from './components/aside-menu/aside-menu.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { CoreModule } from './../core/core.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WelcomeDashboardComponent } from './components/welcome-dashboard/welcome-dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { AddEditUserComponent } from './components/users/add-edit-user/add-edit-user.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AsideMenuComponent,
    WelcomeDashboardComponent,
    UsersComponent,
    AddEditUserComponent,
  ],
  imports: [
    DashboardRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
  ]
})
export class DashboardModule { }
