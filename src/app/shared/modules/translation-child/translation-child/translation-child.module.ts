import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpLoaderFactory } from 'src/app/app.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),

  ],
  exports: [
    TranslateModule
  ]
})
export class TranslationChildModule { }
