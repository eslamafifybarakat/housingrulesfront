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
import { TanksComponent } from './components/tanks/tanks.component';
import { AddEditTankComponent } from './components/tanks/components/add-edit-tank/add-edit-tank.component';
import { TankDetailsComponent } from './components/tanks/components/tank-details/tank-details.component';
import { DriversComponent } from './components/drivers/drivers.component';
import { DriverDetailsComponent } from './components/drivers/components/driver-details/driver-details.component';
import { AddEditDriverComponent } from './components/drivers/components/add-edit-driver/add-edit-driver.component';
import { SupervisorsComponent } from './components/supervisors/supervisors.component';
import { AddEditSupervisorComponent } from './components/supervisors/components/add-edit-supervisor/add-edit-supervisor.component';
import { SupervisorDetailsComponent } from './components/supervisors/components/supervisor-details/supervisor-details.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AsideMenuComponent,
    WelcomeDashboardComponent,
    UsersComponent,
    AddEditUserComponent,
    TanksComponent,
    AddEditTankComponent,
    TankDetailsComponent,
    DriversComponent,
    DriverDetailsComponent,
    AddEditDriverComponent,
    SupervisorsComponent,
    AddEditSupervisorComponent,
    SupervisorDetailsComponent,
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
