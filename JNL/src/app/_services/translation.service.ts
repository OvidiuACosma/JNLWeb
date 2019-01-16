import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private urlAssets = 'assets/Data';

  constructor(private http: HttpClient) { }

  public getTextSearch(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/search.json`);
  }

  public getTextHome(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/home.json`);
  }

  public getTextMenu(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/menu.json`);
  }

}
