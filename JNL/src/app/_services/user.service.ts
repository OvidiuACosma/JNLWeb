import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { ConfigService } from './config.service';

@Injectable()
export class UserService {

    apiURL: string;
    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiURL = configService.getApiURI();
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

    // update(user: User) {
    //     return this.http.put(`${this.apiURL}/users/` + user.id, user);
    // }

    // delete(id: number) {
    //     return this.http.delete(`${this.apiURL}/users/` + id);
    // }
}
