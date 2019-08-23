import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../Auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DataExchangeService } from '../_services';
import { User } from '../_models';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public dialog: MatDialog,
              private dataex: DataExchangeService) { }

  openDialog(): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    // dialogConfig.data = message;
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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('currentUser')) {
      this.dataex.currentUser.subscribe( user => {
        if (!user.id) { this.SetCurrentUser(); }
      });
      // logged in so return true
      return true;
    }
    // not logged in
    return this.openDialog();
  }

  SetCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('currentUser'));
    this.dataex.setCurrentUser(user);
  }

}
