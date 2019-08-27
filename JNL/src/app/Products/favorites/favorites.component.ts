
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService, FavoritesService, ProductsService } from '../../_services';
import { IFavorites, IFavoritesProducts, ProductEF } from '../../_models';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit  {

  language: string;
  text: any;
  favoritesList: IFavorites[];
  currentFavoriteList: IFavorites;
  favoritesProducts: IFavoritesProducts[];
  favoritesProductsDetails: ProductEF[];

  removeAll = false;

  constructor(private router: Router,
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
    this.dataex.currentUser
    .subscribe(user => {
      this.favoritesService.getFavoritesOfRelation(user.userName)
      .subscribe(fav => {
        this.favoritesList = fav;
        this.setFavoriteList(fav[0].id);
      });
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
    this.currentFavoriteList = this.favoritesList.find(f => f.id === favListId);
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
}
