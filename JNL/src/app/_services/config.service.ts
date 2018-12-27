import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    _apiURI: string;
    constructor() {
        this._apiURI = 'https://pro.jnl.be/api';
     }

     getApiURI() {
         return this._apiURI;
     }
}
