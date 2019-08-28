import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { DataExchangeService } from './data-exchange.service';
import { User } from '../_models';

@Injectable()
export class AuthenticationService {

    apiURL: string;

    constructor(private http: HttpClient, private configService: ConfigService, private dataExchange: DataExchangeService) {
        this.apiURL = configService.getApiURI();
    }

    login(username: string, password: string) {
        return this.http.post<User>(`${this.apiURL}/users/login`, { username: username, password: password })
            .pipe(map(user => {
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.dataExchange.setCurrentUser(user);
                }
                return user;
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.dataExchange.setCurrentUser(new User());
    }
}
