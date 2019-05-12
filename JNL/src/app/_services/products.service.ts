import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { Product, ProductEF, ProductHeroImage } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // URL static JSON
  private urlAssets = 'assets/Data';
  private headers: HttpHeaders;
  private prodDescURL = '';
  private product: string;
  private prodHeroImages = '';

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
    this.product = configService.getApiURI() + '/products';
    this.prodDescURL = configService.getApiURI() + '/productsdescriptions';
    this.prodHeroImages = configService.getApiURI() + '/productscollections/heroimages';
  }

  public getProducts(): Observable<ProductEF[]> {
    return this.http.get<ProductEF[]>(`${this.product}`, {headers: this.headers});
  }

  public getTissus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.product}/tissus`, {headers: this.headers});
  }

  public getCuirs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.product}/cuirs`, {headers: this.headers});
  }

  public getProductSearch(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAssets}/Products/search.json`, {headers: this.headers});
  }

  public getSimiliCuirs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.product}/similicuirs`, {headers: this.headers});
  }

  public getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.product}/materials`, {headers: this.headers});
  }

  public getProduct(product: Product): Observable<ProductEF[]> {
    return this.http.get<ProductEF[]>(`${this.product}/${product.brand}/${product.family}/${product.model}`, {headers: this.headers});
  }

  public getProductDesc(product: Product): Observable<any[]> {
    return this.http.get<any[]>(`${this.prodDescURL}/${product.brand}/${product.family}/${product.model}`, {headers: this.headers});
  }

  public getProdHeroImages(product: Product): Observable<ProductHeroImage[]> {
    return this.http.get<ProductHeroImage[]>(`${this.prodHeroImages}/${product.brand}/${product.family} ${product.model}`,
           {headers: this.headers});
  }

  public getGalleryImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAssets}/Products/gallery.json`, {headers: this.headers});
  }
}
