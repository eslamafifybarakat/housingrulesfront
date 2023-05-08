import { NoInternetComponent } from './core/componenets/no-internet/no-internet.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'layout', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) },

  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
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
