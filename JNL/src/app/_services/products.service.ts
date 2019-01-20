import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // URL static JSON
  private urlAssets = 'assets/Data';

 /* private headers: HttpHeaders;
  private accessPointUrl: string; */

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    // this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
   // this.accessPointUrl = configService.getApiURI() + '/products/tissus';
  }

  /* public getTissus(): Observable<any[]> {
    // Get all Tissus data
    return this.http.get<any[]>(this.accessPointUrl, {headers: this.headers});
  }
*/
  public getTissus(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Products/tissus.json`);
  }
}
