
import { Component, OnInit, AfterViewChecked } from '@angular/core';
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

  selected = [0, 0, 0, 0, 0];
  scroller = true;
  numbers: number[] = [];
  fillers: number[] = [];
  removed: number[] = [];
  removeAll = false;
  total: number;
  nrEmpty = 0;

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
    const numberAll = 15;
    this.total = numberAll;
    for (let index = 0; index < numberAll; index++) {
      this.numbers.push(index);
      this.removed[index] = 0;
    }
    this.dataex.currentUser
    .subscribe(user => {
      this.favoritesService.getFavoritesOfRelation(user.userName)
      .subscribe(fav => {
        this.favoritesList = fav;
        this.setFavoriteList(this.favoritesList[0].id);
      });
    });
  }

  removeItem(index: number) {
    this.removed[index] = 1;
    this.scroller = false;
    this.total--;
    // REMOVE FROM DB ?
  }

  removeAllItems() {
    this.removeAll = true;
  }

  getText(lang: string) {
    this.textService.getTextFavorites()
      .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
  }

  NavigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      window.scrollTo(0, 0);
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
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

  getProductImage(id: number): string {
    const product: ProductEF = this.findProductDetails(id);
    const src = `assets/Images/Products/${product.brand}/${product.familyFr}/Search/${product.model}.jpg`;
    return src;
  }

  getAltText(id: number): string {
    const product: ProductEF = this.findProductDetails(id);
    const productAlt = `${product.brand} ${product.familyFr} ${product.model}`;
    return productAlt;
  }

  findProductDetails(id: number): ProductEF {
    const product: ProductEF = this.favoritesProductsDetails.find(f => f.id === id);
    return product;
  }

  goToProduct(product: ProductEF) {
    this.router.navigate(['product', {b: product.brand, f: product.familyFr, m: product.model}]);
    this.scrollTop();
  }

  getProductName(product: ProductEF): string {
    let productName: string;
    switch (this.language.toLowerCase()) {
      case 'fr': {
        productName = product.familyFr;
        break;
      }
      case 'en': {
        productName = product.familyEn;
        break;
      }
    }
    productName = `${productName} ${product.model}`;
    return productName;
  }

  remove(f: IFavoritesProducts) {
    console.log('Remove from favorites:', f);
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
