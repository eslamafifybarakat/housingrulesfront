import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AppRoutes } from '../shared/configs/routes';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: AppRoutes?.auth?.login,
        component: LoginComponent,
        data: {
          title: 'titles.login'
        }
      },
      {
        path: AppRoutes?.auth?.register,
        component: RegisterComponent,
        data: {
          title: 'titles.register'
        }
      },

      {
        path: '',
        redirectTo: AppRoutes?.auth?.login,
        pathMatch: 'full',
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
