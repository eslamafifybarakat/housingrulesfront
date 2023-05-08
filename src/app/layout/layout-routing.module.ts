import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'pages', loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule) },
      {
        path: '',
        redirectTo: 'pages',
        pathMatch: 'full',
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
