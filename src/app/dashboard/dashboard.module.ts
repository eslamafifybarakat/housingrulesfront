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
import { OrdersComponent } from './components/orders/orders.component';
import { FilterOrdersComponent } from './components/orders/components/filter-orders/filter-orders.component';
import { AddEditOrderComponent } from './components/orders/components/add-edit-order/add-edit-order.component';
import { ResetPasswordComponent } from './components/users/reset-password/reset-password.component';
import { ServiceAgentComponent } from './components/service-agent/service-agent.component';
import { AddEditServiceAgentComponent } from './components/service-agent/components/add-edit-service-agent/add-edit-service-agent.component';
import { ServiceAgentDetailsComponent } from './components/service-agent/components/service-agent-details/service-agent-details.component';
import { ConfirmCompleteOrderComponent } from './components/orders/components/confirm-complete-order/confirm-complete-order.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AddEditCustomerComponent } from './components/customers/components/add-edit-customer/add-edit-customer.component';
import { CustomerDetailsComponent } from './components/customers/components/customer-details/customer-details.component';
import { ConfirmOrderComponent } from './components/gates/components/confirm-order/confirm-order.component';
import { OrderDetailsComponent } from './components/orders/components/order-details/order-details.component';
import { GatesComponent } from './components/gates/gates.component';
import { GateDetailsComponent } from './components/gates/components/gate-details/gate-details.component';
import { FinancialSettlementsComponent } from './components/financial-settlements/financial-settlements.component';

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
    OrdersComponent,
    FilterOrdersComponent,
    AddEditOrderComponent,
    ResetPasswordComponent,
    ServiceAgentComponent,
    AddEditServiceAgentComponent,
    ServiceAgentDetailsComponent,
    ConfirmCompleteOrderComponent,
    CustomersComponent,
    AddEditCustomerComponent,
    CustomerDetailsComponent,
    GatesComponent,
    ConfirmOrderComponent,
    OrderDetailsComponent,
    GateDetailsComponent,
    FinancialSettlementsComponent,
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
