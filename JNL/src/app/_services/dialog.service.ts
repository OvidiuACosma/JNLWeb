import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../Main/common-dialog/common-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) { }

  public openDialog(answerTitle: string, answerText: string, buttons: number[] = [0]) {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '400px',
      data: {
        title: answerTitle,
        text: answerText,
        buttons: buttons
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      return result;
    });
    return;
  }
}
