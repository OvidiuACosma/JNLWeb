import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, IUserResetPassword } from '../_models';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../Auth/login/login.component';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

  apiURL: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private configService: ConfigService) {
      this.apiURL = configService.getApiURI();
      this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
  }

  getAll() {
      return this.http.get<User[]>(`${this.apiURL}/users`);
  }

  getById(id: number) {
      return this.http.get(`${this.apiURL}/users/` + id);
  }

  register(user: User) {
      return this.http.post(`${this.apiURL}/users/register`, user);
  }

  resetPassword(resetPassword: IUserResetPassword): Observable<string> {
    return this.http.put<string>(`${this.apiURL}/users/resetpassword`, resetPassword, {headers: this.headers});
  }

  public isLoggedIn(): boolean {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  public openLoginDialog(): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    dialogConfig.minWidth =  '320px';
    dialogConfig.maxWidth =  '450px';
    dialogConfig.minHeight = '320px';
    dialogConfig.maxHeight = '450px';
    dialogConfig.data = '';
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
