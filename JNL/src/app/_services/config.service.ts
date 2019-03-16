import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    _apiURI: string;
    constructor() {
        // this._apiURI = 'https://pro.jnl.be/api';
        this._apiURI = 'https://localhost:44381/api';
     }

     getApiURI() {
         return this._apiURI;
     }
}
