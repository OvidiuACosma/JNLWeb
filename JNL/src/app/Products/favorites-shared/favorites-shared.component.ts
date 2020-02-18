import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, FavoritesService, ProductsService } from '../../_services';
import { IFavorites, IFavoritesProducts, ProductEF, IProductToFavorites, IGarnissageDto, IProdGarnissage, Browser } from '../../_models';
import { concatMap, map, mergeMap } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ProductGarnissageDetailsComponent } from '../product-garnissage-details/product-garnissage-details.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-favorites-shared',
  templateUrl: './favorites-shared.component.html',
  styleUrls: ['./favorites-shared.component.scss']
})
export class FavoritesSharedComponent implements OnInit {

  language: string;
  text: any;
  currentFavoriteList: IFavorites;
  favoritesProducts: IFavoritesProducts[];
  favoritesProductsDetails: ProductEF[];
  browser: Browser;

  productsToFavProd: IProductToFavorites[];
  productsToFavGa: IProductToFavorites[];
  productsToFavFin: IProductToFavorites[];
  productsToFav: IProductToFavorites[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private favoritesService: FavoritesService,
              private productsService: ProductsService,
              public dialog: MatDialog) {
    }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataex.currentLanguage.pipe(
      mergeMap(lang => this.textService.getTextFavorites().pipe(
        mergeMap(text => this.route.params.pipe(
          concatMap(p => this.favoritesService.getFavoritesShared(p.id).pipe(
            mergeMap(fav => this.dataex.currentBrowser.pipe(
              map(_browser => ({
                lang: lang,
                text: text,
                p: p,
                fav: fav,
                browser: _browser
              }))
            ))
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.language = resp.lang || 'EN';
      this.text = resp.text[0][this.language.toUpperCase()];
      this.currentFavoriteList = resp.fav[0];
      this.browser = resp.browser;
      this.getProductsOfFavoriteList(resp.fav[0].id);
    });
  }

  getProductsOfFavoriteList(favListId: number) {
    this.favoritesService.getFavoritesProducts(favListId)
    .subscribe(products => {
      const favProd = this.getFavoritesProductsByType(products, 1);
      const favPGa = this.getFavoritesProductsByType(products, 2);
      const favFin = this.getFavoritesProductsByTypeFin(products, 3);
      this.getProductsDetails(favProd, favPGa, favFin);
    });
  }

  getFavoritesProductsByType(products: IFavoritesProducts[], type: number): { brand: string, id: any}[] {
    return _.filter(products, { type: type })
            .map(m => {
              return { brand: m.productBrand,
               id: type === 2 ? m.prodCode : m.productId };
              });
  }

  getFavoritesProductsByTypeFin(products: IFavoritesProducts[], type: number): { brand: string, id: number, id2: number}[] {
    return _.filter(products, { type: type })
            .map(m => {
              return { brand: m.productBrand,
               id: m.productId,
               id2: m.productId2 };
              });
  }

  getProductsDetails(favProd: any[], favPGa: any[], favFin: any[]) {
    this.favoritesService.getFavoritesProductsProd(favProd, this.language).pipe(
      mergeMap(fProd => this.favoritesService.getFavoritesProductsGa(favPGa, this.language).pipe(
        mergeMap(fGa => this.favoritesService.getFavoritesProductsFin(favFin, this.language).pipe(
          map(fFin => ({
            fProd: fProd,
            fGa: fGa,
            fFin: fFin
          }))
        ))
      ))
    )
    .subscribe(resp => {
      this.productsToFavProd = resp.fProd;
      this.productsToFavGa = resp.fGa;
      this.productsToFavFin = resp.fFin;
      this.productsToFav = [];
      if (this.productsToFavProd) { this.productsToFav.push(...this.productsToFavProd); }
      if (this.productsToFavGa) { this.productsToFav.push(...this.productsToFavGa); }
      if (this.productsToFavFin) { this.productsToFav.push(...this.productsToFavFin); }
    });
  }

  getProductImage(product: IProductToFavorites): string {
    switch (product.type) {
      case 1: {
        return `assets/Images/Products/${product.brand}/${product.text}/Search/${product.model}.jpg`;
      }
      case 2: {
        return`assets/Images/Products/Garnissages/${product.prodCode.toUpperCase()}.jpg`;
      }
      case 3: {
        return `assets/Images/Products/${product.brand}/Samples/Print/${product.text}.jpg`;
      }
    }
    return '';
  }

  getAltText(product: IProductToFavorites): string {
    return `${product.brand} ${product.family} ${product.model}`;
  }

  goToProduct(product: IProductToFavorites) {
    switch (product.type) {
      case 1: {
        this.router.navigate(['product/product', {b: product.brand, f: product.text, m: product.model}]);
        this.scrollTop();
        break;
      }
      case 2: {
        this.showProductGa(product);
        break;
      }
      case 3: {
        this.showProductFin(product);
        break;
      }
    }
  }

  showProductGa(product: IProductToFavorites) {
    const ga: IGarnissageDto = { materialFr: product.text, model: product.model };
    this.productsService.getGarnissage(ga).subscribe(resp => {
      if (resp) {
        const garn: IProdGarnissage[] = this.productsService.mapProducts(resp, this.language);
        const dialogConfig = this.productsService.getGarnissageDialogConfig(garn[0], 'ga', this.browser.isDesktopDevice);
        this.openDialogGa(dialogConfig);
      }
    });
  }

  showProductFin(product: IProductToFavorites) {
    const dialogConfig = this.productsService.getGarnissageDialogConfig(product, 'fin', this.browser.isDesktopDevice);
    this.openDialogGa(dialogConfig);
  }

  openDialogGa(dialogConfig: MatDialogConfig<any>) {
    const dialogRef = this.dialog.open(ProductGarnissageDetailsComponent, dialogConfig);
  }

  getProductName(product: IProductToFavorites): string {
    return `${product.family} ${product.model}`;
  }

  // getProductsOfFavoriteList(favListId: number) {
  //   this.favoritesService.getFavoritesProducts(favListId)
  //   .subscribe(products => {
  //     this.favoritesProducts = products;
  //     const prodIds: number[] = [];
  //     products.forEach(element => {
  //       prodIds.push(element.productId);
  //     });
  //     if (prodIds.length > 0) {
  //       this.getProductsDetails(prodIds);
  //     }
  //   });
  // }

  // getProductsDetails(ids: number[]) {
  //   this.productsService.getProductsListFromIds(ids)
  //   .subscribe(prod => {
  //     this.favoritesProductsDetails = prod;
  //   });
  // }

  // getProductImage(product: IFavoritesProducts): string {
  //   const prod: ProductEF = this.findProductDetails(product.productId);
  //   const src = `assets/Images/Products/${prod.brand}/${prod.familyFr}/Search/${prod.model}.jpg`;
  //   return src;
  // }

  // getAltText(product: IFavoritesProducts): string {
  //   const prod: ProductEF = this.findProductDetails(product.productId);
  //   const productAlt = `${prod.brand} ${prod.familyFr} ${prod.model}`;
  //   return productAlt;
  // }

  // findProductDetails(id: number): ProductEF {
  //   const product: ProductEF = this.favoritesProductsDetails.find(f => f.id === id);
  //   return product;
  // }

  // goToProduct(product: IFavoritesProducts) {
  //   const prod = this.findProductDetails(product.productId);
  //   this.router.navigate(['product/product', {b: prod.brand, f: prod.familyFr, m: prod.model}]);
  //   this.scrollTop();
  // }

  // getProductName(product: IFavoritesProducts): string {
  //   const prod = this.findProductDetails(product.productId);
  //   let productName: string;
  //   switch (this.language.toLowerCase()) {
  //     case 'fr': {
  //       productName = prod.familyFr;
  //       break;
  //     }
  //     case 'en': {
  //       productName = prod.familyEn;
  //       break;
  //     }
  //   }
  //   productName = `${productName} ${prod.model}`;
  //   return productName;
  // }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
