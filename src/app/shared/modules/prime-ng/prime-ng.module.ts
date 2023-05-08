import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { CarouselModule } from 'primeng/carousel';
import { PaginatorModule } from 'primeng/paginator';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { RatingModule } from 'primeng/rating';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { CalendarModule } from 'primeng/calendar';
import { StepsModule } from 'primeng/steps';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { TreeSelectModule } from 'primeng/treeselect';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';

const primeNgModules = [
  DynamicDialogModule,
  ConfirmDialogModule,
  MultiSelectModule,
  ProgressBarModule,
  InputSwitchModule,
  FileUploadModule,
  TreeSelectModule,
  InputTextModule,
  PaginatorModule,
  CheckboxModule,
  CalendarModule,
  DropdownModule,
  CarouselModule,
  SkeletonModule,
  PasswordModule,
  DividerModule,
  MenubarModule,
  TooltipModule,
  SliderModule,
  ButtonModule,
  DialogModule,
  AvatarModule,
  RatingModule,
  StepsModule,
  ToastModule,
  TableModule,
];
@NgModule({
  declarations: [],
  imports: [
    ...primeNgModules
  ],
  exports: [
    ...primeNgModules
  ],
  providers: [MessageService, ConfirmationService],
})
export class PrimeNgModule { }
