import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PredictComponent } from '../predict/predict.component';

@Component({
  selector: 'app-buycom',
  templateUrl: './dialog.html',
  styles: ['./dialog.css'],
})
export class BuycomComponent {

    constructor(
    public dialogRef: MatDialogRef<BuycomComponent>) {}

    onNoClick(): void {
    this.dialogRef.close();
  }

}
