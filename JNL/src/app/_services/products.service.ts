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

 private headers: HttpHeaders;

 // Access Point URLs
 private tissusUrl: string;
 private cuirsUrl: string;
 private similiCuirsUrl: string;

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
    this.tissusUrl = configService.getApiURI() + '/products/tissus';
    this.cuirsUrl = configService.getApiURI() + '/products/cuirs';
    this.similiCuirsUrl = configService.getApiURI() + '/products/similicuirs';
  }

  public getTissus(): Observable<any[]> {
    // Get all Tissus data
    return this.http.get<any[]>(this.tissusUrl, {headers: this.headers});
  }

  public getCuirs(): Observable<any[]> {
    return this.http.get<any[]>(this.cuirsUrl, {headers: this.headers});
  }

  public getSimiliCuirs(): Observable<any[]> {
    return this.http.get<any[]>(this.similiCuirsUrl, {headers: this.headers});
  }

/*
  public getTissus(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Products/tissus.json`);
  } */
}
