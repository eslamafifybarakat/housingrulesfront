import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '', component: PagesComponent, children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
