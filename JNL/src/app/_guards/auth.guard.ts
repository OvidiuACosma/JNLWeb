import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';

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
      const token = JSON.parse(localStorage.getItem('currentUser')).token;
      const helper = new JwtHelperService();
      if (helper.isTokenExpired(token)) { return false; }
      return true;
    }
    return false;
  }

  public logIn() {
    this.userService.openLoginDialog().subscribe(answer => {
      return answer;
    });
  }
}
