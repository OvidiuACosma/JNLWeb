import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { AnyKindOfDictionary } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // URL static JSON
  private urlAssets = 'assets/Data';

 private headers: HttpHeaders;

 // Access Point URLs
 private tissus: string;
 private cuirs: string;
 private simili: string;
 private prodDescURL = '';
 private product: string;

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
    this.tissus = configService.getApiURI() + '/products/tissus';
    this.cuirs = configService.getApiURI() + '/products/cuirs';
    this.simili = configService.getApiURI() + '/products/similicuirs';
    this.product = configService.getApiURI() + '/products/';
    this.prodDescURL = configService.getApiURI() + '/productsdescriptions/';
  }

  public getTissus(): Observable<any[]> {
    // Get all Tissus data
    return this.http.get<any[]>(this.tissus, {headers: this.headers});
  }

  public getCuirs(): Observable<any[]> {
    return this.http.get<any[]>(this.cuirs, {headers: this.headers});
  }

  public getProductSearch(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAssets}/Products/search.json`, {headers: this.headers});
  }

  public getSimiliCuirs(): Observable<any[]> {
    return this.http.get<any[]>(this.simili, {headers: this.headers});
  }

  public getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.product}/materials`, {headers: this.headers});
  }

  public getProduct(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.product}/${id}`, {headers: this.headers});
  }

  public getProductDesc(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.prodDescURL}/${id}`, {headers: this.headers});
  }


/*
  public getTissus(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Products/tissus.json`);
  } */
}
