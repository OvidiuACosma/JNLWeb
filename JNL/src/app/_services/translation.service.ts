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
    return this.http.get(`${this.urlAssets}/Std/marques.json`);
  }

  public getTextMarque(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Std/marque.json`);
  }

  public getTextSavoir(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Std/savoir.json`);
  }

  public getTextServices(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Std/services.json`);
  }

  public getTextGroupe(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Std/group.json`);
  }

  public getTextPresse(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Std/press.json`);
  }

  public getTextContact(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/contact.json`);
  }

  public getTextActualite(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Std/actualite.json`);
  }

  public getTextFavorites(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Products/favorites.json`);
  }

  public getTextProductStandard(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Products/product-description.json`);
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

  public getTextRequest(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Std/request.json`);
  }

}
