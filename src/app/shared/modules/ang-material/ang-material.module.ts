import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from "@angular/core";
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

const materialModules = [
  MatSlideToggleModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatStepperModule,
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatIconModule,
];

@NgModule({
  imports: [
    ...materialModules
  ],
  exports: [
    ...materialModules
  ]
})
export class AngMaterialModule { }
