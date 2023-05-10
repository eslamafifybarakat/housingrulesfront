import { WelcomeDashboardComponent } from './components/welcome-dashboard/welcome-dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { TanksComponent } from './components/tanks/tanks.component';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from '../shared/configs/routes';
import { NgModule } from '@angular/core';
import { DriversComponent } from './components/drivers/drivers.component';
import { SupervisorsComponent } from './components/supervisors/supervisors.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: AppRoutes?.dashboard?.welcome,
        component: WelcomeDashboardComponent,
        data: {
          title: 'titles.welcome',
          type: 'dashboard'
        }
      },
      {
        path: AppRoutes?.dashboard?.tanks,
        component: TanksComponent,
        data: {
          title: 'titles.tanks',
          type: 'dashboard'
        }
      },
      {
        path: AppRoutes?.dashboard?.drivers,
        component: DriversComponent,
        data: {
          title: 'titles.drivers',
          type: 'dashboard'
        }
      },
      {
        path: AppRoutes?.dashboard?.supervisors,
        component: SupervisorsComponent,
        data: {
          title: 'titles.supervisors',
          type: 'dashboard'
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'titles.users',
          type: 'dashboard'
        }
      },
      {
        path: '',
        redirectTo: AppRoutes?.dashboard?.welcome,
        pathMatch: 'full',
      },
      { path: '**', redirectTo: 'error' }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
