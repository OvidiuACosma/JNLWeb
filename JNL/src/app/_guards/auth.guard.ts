import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../Auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DataExchangeService } from '../_services';

@Injectable()
export class AuthGuard implements CanActivate {

  returnUrl = '';

  constructor(public dialog: MatDialog,
              private dataex: DataExchangeService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.returnUrl = state.url;
    if (!this.isLoggedIn()) {
      this.logIn();
    }
    return this.isLoggedIn();
  }

  public isLoggedIn() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  public logIn() {
    this.openDialog().subscribe( answer => {
      return answer;
    });
  }

  public openDialog(): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    dialogConfig.data = this.returnUrl;
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    return dialogRef.afterClosed()
    .pipe(
      map(result => {
      return result;
    }));
  }

}
