import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { RequestForm } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private headers: HttpHeaders;
  private reqUrl: string;

  constructor(private http: HttpClient,
    private configService: ConfigService) {
      this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
      this.reqUrl = configService.getApiURI() + '/requests';
    }

    public postRequest(request: RequestForm): Observable<RequestForm> {
      return this.http.post<RequestForm>(this.reqUrl, request, {headers: this.headers});
    }
}
