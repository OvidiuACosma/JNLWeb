import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { Product, ProductEF, ProductHeroImage, IGarnissage, User, IGarnissageDto,
         IProdGarnissage, IProductReadyToSell, IGarnissageRts, IProductToFavorites,
         IProductDescription, IProductShareByEmail, IGarnissageColors } from '../_models';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { FavoritesSelListComponent } from '../Products/favorites-sel-list/favorites-sel-list.component';
import { DataExchangeService } from './data-exchange.service';
import { UserService } from './user.service';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // URL static JSON
  private urlAssets = 'assets/Data';
  private headers: HttpHeaders;
  private prodDescURL = '';
  private product: string;
  private productReadyToSell: string;
  private prodHeroImages = '';

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private userService: UserService,
              private dialog: MatDialog,
              private dataex: DataExchangeService) {
    this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
    this.product = configService.getApiURI() + '/products';
    this.productReadyToSell = configService.getApiURI() + '/products/readytosell';
    this.prodDescURL = configService.getApiURI() + '/productsdescriptions';
    this.prodHeroImages = configService.getApiURI() + '/productscollections/heroimages';
  }

  public getProducts(): Observable<ProductEF[]> {
    return this.http.get<ProductEF[]>(`${this.product}`, {headers: this.headers});
  }

  public getGarnissages(): Observable<IGarnissage[]> {
    return this.http.get<IGarnissage[]>(`${this.product}/GA`, {headers: this.headers});
  }

  public getGarnissagesColors(): Observable<IGarnissageColors[]> {
    return this.http.get<IGarnissageColors[]>(`${this.product}/GAColors`, {headers: this.headers});
  }

  public getGarnissage(garnissage: IGarnissageDto): Observable<IGarnissage[]> {
    return this.http.post<IGarnissage[]>(`${this.product}/GA`, garnissage, {headers: this.headers});
  }

  public getProductSearch(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAssets}/Products/search.json`, {headers: this.headers});
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

  public getProductDesc(product: Product): Observable<IProductDescription[]> {
    return this.http.get<IProductDescription[]>(`${this.prodDescURL}/${product.brand}/${product.family}/${product.model}`,
    {headers: this.headers});
  }

  public getProductDescShort(product: Product): Observable<IProductDescription[]> {
    return this.http.get<IProductDescription[]>(`${this.prodDescURL}/short/${product.brand}/${product.family}/${product.model}`,
    {headers: this.headers});
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

  public getProdReadyToSellImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAssets}/Products/readyToSellImages.json`, {headers: this.headers});
  }

  public getProductsReadyToSell(userType: string): Observable<IProductReadyToSell[]> {
    return this.http.get<IProductReadyToSell[]>(`${this.productReadyToSell}/all/${userType}`, {headers: this.headers});
  }

  public getProductReadyToSell(productId: number, userType: string): Observable<IProductReadyToSell> {
    return this.http.get<IProductReadyToSell>(`${this.productReadyToSell}/one/${productId}/${userType}`, {headers: this.headers});
  }

  public getProdReadyToSellGarnissages(productId: number): Observable<IGarnissageRts[]> {
    return this.http.get<IGarnissageRts[]>(`${this.product}/GARTS/${productId}`, {headers: this.headers});
  }

  public shareProductByEmail(product: IProductShareByEmail): Observable<string> {
    return this.http.post<string>(`${this.product}/sharebyemail`, product, {headers: this.headers});
  }


  openDialog(productToFavorites: IProductToFavorites, user: User): Observable<boolean> {
    this.dataex.currentBrowser.subscribe(browser => {
      let width = '70%';
      if (browser.isMobile || browser.isTablet) { width = '100%'; }
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = width;
      dialogConfig.maxWidth = '840px';
      dialogConfig.maxHeight = '620px';
      dialogConfig.data = { productToFavorites, user };
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

  public getGarnissageDialogConfig(garn: any, type: string, isDesktop: boolean): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = this.getDialogWidth(isDesktop);
    dialogConfig.maxWidth = '960px';
    // dialogConfig.maxHeight = '825px';
    dialogConfig.data = { dialogData: garn,
                          type: type};
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    return dialogConfig;
  }

  getDialogWidth(isDesktop: boolean): string {
    let width = '40vw';
    if (!isDesktop) {
      width = '98%';
    }
    return width;
  }

  public mapProducts(products: IGarnissage[], lang: string, gaColors: IGarnissageColors[] = []): IProdGarnissage[] {
    let productsMapped: IProdGarnissage[];
    switch (lang.toLowerCase()) {
      case 'en': {
        productsMapped = products.map(m => {
          return {
            id: m.id,
            codeProd: m.codeProd,
            material: m.materialEn,
            model: m.model,
            dimensions: m.dimensions,
            composition: m.compositionEn,
            martindale: m.martindale,
            type: this.getTypeStringFromBoolean(m.gaCoussinOnly, lang),
            brand: this.getBrandStringFromNumeric(m.brand),
            color: m.colorEn,
            colorRef: m.colorRef,
            gaColors: this.getGaColors(m.gaColors, lang, gaColors)
          };
        });
        break;
      }
      case 'fr': {
        productsMapped = products.map(m => {
          return {
            id: m.id,
            codeProd: m.codeProd,
            material: m.materialFr,
            model: m.model,
            dimensions: m.dimensions,
            composition: m.compositionFr,
            martindale: m.martindale,
            type: this.getTypeStringFromBoolean(m.gaCoussinOnly, lang),
            brand: this.getBrandStringFromNumeric(m.brand),
            color: m.colorFr,
            colorRef: m.colorRef,
            gaColors: this.getGaColors(m.gaColors, lang, gaColors)
          };
        });
      }
    }
    return productsMapped;
  }

  getTypeStringFromBoolean(t: boolean = false, lang: string): string {
    if (!!t) {
      switch (lang.toLowerCase()) {
        case 'en': {return 'Cushions only'; }
        case 'fr' : {return 'Coussins seulement'; }
      }
    } else {
      switch (lang.toLowerCase()) {
        case 'en': {return 'Upholstery'; }
        case 'fr' : {return 'Garnissage'; }
      }
    }
  }

  getBrandStringFromNumeric(b: number): string {
    switch (b) {
      case 0: { return 'JNL Collection'; }
      case 1: { return 'Ungaro Home'; }
      case 2: { return 'Ungaro Home'; }
    }
  }

  getGaColors(colorsList: string, lang: string, gaColors: IGarnissageColors[]): string[] {
    let gaColorsText: string[] = [];
    if (gaColors.length) {
      gaColorsText = colorsList.split(',').map(m => this.getColorName(m, lang, gaColors));
    }
    return gaColorsText;
  }

  getColorName(id: string, lang: string, gaColors: IGarnissageColors[]): string {
    const idNumber = Number(id) || 0;
    let gaColor: string;
    switch (lang) {
      case 'EN': {
        gaColor = _.find(gaColors, { 'id': idNumber }).color || '';
        break;
      }
      case 'FR': {
        gaColor = _.find(gaColors, { 'id': idNumber }).colorFr || '';
        break;
      }
      default: {
        gaColor = _.find(gaColors, { 'id': idNumber }).color || '';
        break;
      }
    }

    return gaColor;
  }

  getProductToFavorites(product: any, language: string, type: number): IProductToFavorites {
    const productToFavorites: IProductToFavorites = {
      brand: product.brand,
      id: product.id,
      id2: 0,
      type: type,
      prodCode: null,
      family: language === 'EN' ? product.familyEn : language === 'FR' ? product.familyFr : product.familyEn,
      model: product.model,
      text: ''
    };
    return productToFavorites;
  }

  addToFavorites(product: IProductToFavorites, user: User) {
      if (this.userService.isLoggedIn()) {
        this.openDialog(product, user);
      } else {
        this.userService.openLoginDialog().subscribe(answer => {
          if (answer) {
            this.openDialog(product, user);
          } else {
            console.log('Not logged in. Can\'t add to favorites');
          }
        });
      }
  }


}
