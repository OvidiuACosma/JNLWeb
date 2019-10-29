import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogData } from 'src/app/_models';

@Component({
  selector: 'app-pricelist-dialog',
  templateUrl: './pricelist-dialog.component.html',
  styleUrls: ['./pricelist-dialog.component.scss']
})

export class PricelistDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PricelistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {}

  ngOnInit() {
  }

  labelClick(label: string): void {
    // TODO: download PL
    this.dialogRef.close(label);
  }
}
