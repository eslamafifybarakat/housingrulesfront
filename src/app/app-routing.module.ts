import { NoInternetComponent } from './core/componenets/no-internet/no-internet.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { AppRoutes } from './shared/configs/routes';

const routes: Routes = [
  {
    path: 'layout',
    loadChildren: () => import('./layout/layout.module')
      .then(m => m.LayoutModule)
  },

  {
    path: 'auth',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule),
    data: {
      moduleType: 'dashboard'
    }
  },
  { path: 'no-internet', component: NoInternetComponent },

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
  { path: '**', redirectTo: AppRoutes?.error }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        useHash: false,
        scrollPositionRestoration: 'top'
      }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
