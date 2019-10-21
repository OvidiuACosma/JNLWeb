import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, FavoritesService, ProductsService } from '../../_services';
import { IFavorites, IFavoritesProducts, ProductEF } from '../../_models';
import { concatMap, map, mergeMap } from 'rxjs/operators';

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private favoritesService: FavoritesService,
              private productsService: ProductsService) {
    }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataex.currentLanguage.pipe(
      mergeMap(lang => this.textService.getTextFavorites().pipe(
        mergeMap(text => this.route.params.pipe(
          concatMap(p => this.favoritesService.getFavoritesShared(p.id).pipe(
              map(fav => ({
                lang: lang,
                text: text,
                p: p,
                fav: fav
              })
            )
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.language = resp.lang;
      this.text = resp.text[0][resp.lang.toUpperCase()];
      this.currentFavoriteList = resp.fav[0];
      this.getProductsOfFavoriteList(resp.fav[0].id);
    });
  }

  getProductsOfFavoriteList(favListId: number) {
    this.favoritesService.getFavoritesProducts(favListId)
    .subscribe(products => {
      this.favoritesProducts = products;
      const prodIds: number[] = [];
      products.forEach(element => {
        prodIds.push(element.productId);
      });
      if (prodIds.length > 0) {
        this.getProductsDetails(prodIds);
      }
    });
  }

  getProductsDetails(ids: number[]) {
    this.productsService.getProductsListFromIds(ids)
    .subscribe(prod => {
      this.favoritesProductsDetails = prod;
    });
  }

  getProductImage(product: IFavoritesProducts): string {
    const prod: ProductEF = this.findProductDetails(product.productId);
    const src = `assets/Images/Products/${prod.brand}/${prod.familyFr}/Search/${prod.model}.jpg`;
    return src;
  }

  getAltText(product: IFavoritesProducts): string {
    const prod: ProductEF = this.findProductDetails(product.productId);
    const productAlt = `${prod.brand} ${prod.familyFr} ${prod.model}`;
    return productAlt;
  }

  findProductDetails(id: number): ProductEF {
    const product: ProductEF = this.favoritesProductsDetails.find(f => f.id === id);
    return product;
  }

  goToProduct(product: IFavoritesProducts) {
    const prod = this.findProductDetails(product.productId);
    this.router.navigate(['product/product', {b: prod.brand, f: prod.familyFr, m: prod.model}]);
    this.scrollTop();
  }

  getProductName(product: IFavoritesProducts): string {
    const prod = this.findProductDetails(product.productId);
    let productName: string;
    switch (this.language.toLowerCase()) {
      case 'fr': {
        productName = prod.familyFr;
        break;
      }
      case 'en': {
        productName = prod.familyEn;
        break;
      }
    }
    productName = `${productName} ${prod.model}`;
    return productName;
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
