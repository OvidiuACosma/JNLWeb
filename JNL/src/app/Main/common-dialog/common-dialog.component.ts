import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogData } from 'src/app/_models';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss']
})

export class CommonDialogComponent implements OnInit {

  labels: string[] = [];
  labelsText = ['OK', 'Cancel', 'Login', 'Contact'];

  constructor(
    public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {}

  ngOnInit(): void {
    if (this.data.buttons) {
      this.data.buttons.forEach(element => {
        this.labels.push(this.labelsText[element]);
      });
    }
  }

  labelClick(label: string): void {
    this.dialogRef.close(label);
  }

}
