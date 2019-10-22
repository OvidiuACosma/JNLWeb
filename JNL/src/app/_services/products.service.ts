import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { Product, ProductEF, ProductHeroImage, IGarnissage, User } from '../_models';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../Auth/login/login.component';
import { map } from 'rxjs/operators';
import { FavoritesSelListComponent } from '../Products/favorites-sel-list/favorites-sel-list.component';
import { DataExchangeService } from './data-exchange.service';

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
              private configService: ConfigService,
              private dialog: MatDialog,
              private dataex: DataExchangeService) {
    this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
    this.product = configService.getApiURI() + '/products';
    this.prodDescURL = configService.getApiURI() + '/productsdescriptions';
    this.prodHeroImages = configService.getApiURI() + '/productscollections/heroimages';
  }

  public getProducts(): Observable<ProductEF[]> {
    return this.http.get<ProductEF[]>(`${this.product}`, {headers: this.headers});
  }

  public getGarnissages(): Observable<IGarnissage[]> {
    return this.http.get<IGarnissage[]>(`${this.product}/GA`, {headers: this.headers});
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

  public getProductsListFromIds(productsIds: number[]): Observable<ProductEF[]> {
    return this.http.post<ProductEF[]>(`${this.product}/Ids`, productsIds, {headers: this.headers});
  }

  public getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.product}/materials`, {headers: this.headers});
  }

  public getProduct(product: Product): Observable<ProductEF> {
    return this.http.get<ProductEF>(`${this.product}/${product.brand}/${product.family}/${product.model}`, {headers: this.headers});
  }

  public getProductDesc(product: Product): Observable<any[]> {
    return this.http.get<any[]>(`${this.prodDescURL}/${product.brand}/${product.family}/${product.model}`, {headers: this.headers});
  }

  public getProdHeroImages(product: Product): Observable<ProductHeroImage[]> {
    return this.http.get<ProductHeroImage[]>(`${this.prodHeroImages}/${product.brand}/${product.family} ${product.model}`,
           {headers: this.headers});
  }

  public getProdGalleryImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAssets}/Products/gallery.json`, {headers: this.headers});
  }

  public getProdTechDetImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAssets}/Products/techDetImages.json`, {headers: this.headers});
  }


  public isLoggedIn(): boolean {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  openLoginDialog(): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    dialogConfig.data = '';
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    return dialogRef.afterClosed()
    .pipe(
      map(result => {
      return result;
    }));
  }

  openDialog(product: ProductEF, user: User): Observable<boolean> {
    this.dataex.currentBrowser.subscribe(browser => {
      let width = '70%';
      if (browser.isMobile || browser.isTablet) { width = '100%'; }
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = width;
      dialogConfig.maxWidth = '100%';
      dialogConfig.data = { product, user };
      dialogConfig.hasBackdrop = true;
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      const dialogRef = this.dialog.open(FavoritesSelListComponent, dialogConfig);
      return dialogRef.afterClosed()
      .pipe(
        map(result => {
        return result;
      }));
    });
    return of(false);
  }
}
