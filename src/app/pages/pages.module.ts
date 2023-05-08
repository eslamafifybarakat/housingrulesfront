import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { CoreModule } from '../core/core.module';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    PagesComponent,
  ],
  imports: [
    ReactiveFormsModule,
    PagesRoutingModule,
    AgmCoreModule,
    CommonModule,
    SharedModule,
    FormsModule,
    CoreModule
  ]
})
export class PagesModule { }
