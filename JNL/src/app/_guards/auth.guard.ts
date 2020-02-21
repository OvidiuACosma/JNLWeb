import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../_services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  returnUrl = '';

  constructor(public dialog: MatDialog,
              private userService: UserService) { }

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
    this.userService.openLoginDialog().subscribe(answer => {
      return answer;
    });
    // this.openDialog().subscribe( answer => {
    //   return answer;
    // });
  }
}
