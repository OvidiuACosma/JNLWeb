import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, IUserResetPassword } from '../_models';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

    apiURL: string;
    private headers: HttpHeaders;

    constructor(private http: HttpClient, private configService: ConfigService) {
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

    // update(user: User) {
    //     return this.http.put(`${this.apiURL}/users/` + user.id, user);
    // }

    // delete(id: number) {
    //     return this.http.delete(`${this.apiURL}/users/` + id);
    // }
}
