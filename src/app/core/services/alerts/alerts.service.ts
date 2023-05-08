import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import Swal from "sweetalert2";
@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  // x: any = {};
  openSweetAlert(sweetAlertIcon: any, sweetAlertMsg: any) {
    // sweetAlertIcon? this.x[sweetAlertIcon]=sweetAlertIcon:''
    Swal.fire({
      // icon [error , info , success , warning , question]
      // position [top-end , bottom-end , bottom-start , top-start]
      title: '',
      text: sweetAlertMsg,
      icon: sweetAlertIcon,
      // confirmButtonText: this.translateService.instant('ok'),
      // timer: 1500,
      // showCloseButton: true,
    });
  }

  openSnackBar(message: string, duration?: number, horizontal?: MatSnackBarHorizontalPosition, vertical?: MatSnackBarVerticalPosition) {
    //  vertical=['top','bottom']
    //  horizontal=['start','center','end','left','right']
    this._snackBar.open(message, 'X', {
      duration: duration ? duration : 2000,
      horizontalPosition: horizontal ? horizontal : 'center',
      verticalPosition: vertical ? vertical : 'bottom',
    });
  }
}
