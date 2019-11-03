import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonDialogComponent } from '../Main/common-dialog/common-dialog.component';
import { AuthGuard } from '../_guards/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private authGuard: AuthGuard,
              private router: Router,
              public dialog: MatDialog) { }

  public openDialog(answerTitle: string, answerText: string, buttons: number[] = [0]): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '400px',
      data: {
        title: answerTitle,
        text: answerText,
        buttons: buttons
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.resultAction(result);
    });
  }

  resultAction(result: string) {
    switch (result) {
      case 'Login': {
        this.authGuard.logIn();
        return;
      }
      case 'Contact': {
        this.navigateTo('contact', '', '6');
        return;
      }
      default: {
        return;
      }
    }
  }

  navigateTo(target: string, fragment: string = '', param: string = '') {
    if (fragment === '') {
      this.scrollTop();
      if (param === '') {
        this.router.navigate([target]);
      } else {
        this.router.navigate([target, param]);
      }
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
