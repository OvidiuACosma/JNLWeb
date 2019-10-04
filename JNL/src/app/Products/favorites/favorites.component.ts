
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, FavoritesService, ProductsService } from '../../_services';
import { IFavorites, IFavoritesProducts, ProductEF, User } from '../../_models';
import { concatMap, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit  {

  language: string;
  text: any;
  favoritesList: IFavorites[];
  currentFavoriteList: IFavorites;
  favoritesProducts: IFavoritesProducts[];
  favoritesProductsDetails: ProductEF[];
  listId = 0;

  removeAll = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private favoritesService: FavoritesService,
              private productsService: ProductsService) {
    }

  ngOnInit() {
    this.dataex.currentLanguage
      .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });

    this.route.params
    .pipe(
      mergeMap( p => (this.dataex.currentUser)
        .pipe(
          concatMap( user => this.favoritesService.getFavoritesOfRelation(user.userName)
            .pipe(
              map(resp => ({
                p: p,
                user: user,
                fav: resp
              }))
            )
          )
        )
      )
    )
    .subscribe(response => {
      this.favoritesList = response.fav;
      this.listId = parseInt(response.p.id, 10);
      const i = this.listId !== 0 ? this.listId : response.fav[0].id;
      this.currentFavoriteList = response.fav.find(f => f.id === i);
      this.setFavoriteList(i);
    });
  }

  getText(lang: string) {
    this.textService.getTextFavorites()
      .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res, lang);
    });
  }

  getLanguageText(res: any, lang: string) {
    this.text = res[lang.toUpperCase()];
  }

  setFavoriteList(favListId: number) {
    this.getProductsOfFavoriteList(favListId);
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

  remove(f: IFavoritesProducts) {
    this.favoritesService.deleteFavoritesLG(f.id)
    .subscribe(res => {
      console.log(res.productBrand, res.productId, 'removed from favorites.');
      this.setFavoriteList(res.favoritesId);
    });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  showListId() {
    console.log('Show list id:', this.listId);
  }
}
