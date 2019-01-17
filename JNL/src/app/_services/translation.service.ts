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

  public getTextMarques(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/marques.json`);
  }

  public getTextJnl(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/jnl.json`);
  }

  public getTextVanhamme(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/vanhamme.json`);
  }

  public getTextUngaro(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/ungaro.json`);
  }

  public getTextLuz(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/luz.json`);
  }

  public getTextSavoir(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/savoir.json`);
  }

  public getTextServices(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/services.json`);
  }

  public getTextGroupe(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/groupe.json`);
  }

  public getTextPresse(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/presse.json`);
  }

  public getTextContact(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/contact.json`);
  }

  public getTextLegal(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/legal.json`);
  }

  public getTextPrivacy(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/privacy.json`);
  }

  public getTextCredits(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/credits.json`);
  }

  public getTextPageNotFound(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/pagenotfound.json`);
  }

}
