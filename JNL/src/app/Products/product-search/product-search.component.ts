import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, ProductsService } from '../../_services';
import { Product, ProductEF } from '../../_models';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit/** ,  AfterViewChecked*/ {

  public products: ProductEF[];
  public productsFiltered: ProductEF[];
  public selectedProduct: Product;
  public categoriesFr: any;
  public categoriesEn: any;
  public product: string; // TODO: kill it when killing the search button
  language: string;
  text: any;
  filterBy: string[] = ['Brand', 'Type'];
  collectionsText = ['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'Luz Interiors'];

  selected = [0, 0, 0, 0, 0];
  scroller = true;
  numbers: number[] = [];
  total: number;
  res: any;

  toggle: boolean[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private productService: ProductsService) {}

  ngOnInit() {
    this.dataex.currentLanguage
      .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);

      this.productService.getProducts()
      .subscribe(p => {
        this.products = p.sort(function(a, b) {
          if (a.brand.localeCompare(b.brand) > 0) { return 1; }
          if (a.brand.localeCompare(b.brand) < 0) { return -1; }
          if (a.familyFr.localeCompare(b.familyFr) > 0) { return 1; }
          if (a.familyFr.localeCompare(b.familyFr) < 0) { return -1; }
          if (a.model.localeCompare(b.model) > 0) { return 1; }
          return -1;
        });
        this.productsFiltered = _.clone(this.products);
        this.categoriesFr = new Set(this.products.map(c => c.categoryFr));
        this.categoriesEn = new Set(this.products.map(c => c.categoryEn));
     });
    });
    this.toggle = new Array(this.filterBy.length);
    for (let i = 0; i < this.filterBy.length; i++) {
      this.toggle[i] = true;
    }
    const numberAll = 15;
    this.total = numberAll;

    for (let index = 0; index < numberAll; index++) {
      this.numbers.push(index);
    }
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

  getFilters(category: string): any {
    switch (category.toLowerCase()) {
      case 'brand': {
        return this.collectionsText;
      }
      case 'type': {
        switch (this.language.toLowerCase()) {
          case 'en': {
            return this.categoriesEn;
          }
          case 'fr': {
            return this.categoriesFr;
          }
        }
      }
    }
    return [];
  }

  navigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      window.scrollTo(0, 0);
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  selectMarque(nr: number) {
    if (this.selected[nr] === 1) {
      this.selected[nr] = 0;
    } else {
      this.selected[nr] = 1;
    }
    this.scroller = false;
  }

  // CHANGE function for FAV
  removeItem(index: number) {
    this.scroller = false;
    this.total--;
    // REMOVE FROM DB ?
  }

  selectFilter() {
    this.scroller = false;
  }

  toggleFilters(index: number) {
    this.toggle[index] = !this.toggle[index];
    this.scroller = false;
  }

  getArrow(i: number): string {
    if (this.toggle[i]) {
      return 'assets/Images/Common/arrow_up_gold.png';
    }
    return 'assets/Images/Common/arrow_down_gold.png';
  }

  getProductImage(product: ProductEF): string {
    const src = `assets/Images/Products/${product.brand}/${product.familyFr}/Search/${product.model}.jpg`;
    return src;
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

  // ngAfterViewChecked() {
  //   this.route.fragment.subscribe(fragment => {
  //     if (fragment) {
  //       const element = document.getElementById(fragment);
  //       if (element && this.scroller === true ) {
  //         element.scrollIntoView({block: 'start', behavior: 'smooth'});
  //       }
  //       this.scroller = true;
  //     } else if (this.scroller === true) {
  //         window.scrollTo(0, 0);
  //       }
  //   });
  // }

  goToProduct(product: ProductEF) {
    this.router.navigate(['product', {b: product.brand, f: product.familyFr, m: product.model}]);
    this.scrollTop();
  }

  addToFavorites(product: Product) {
    // TODO: check the user - login if not yet
    // post the product to user's favorites
    window.alert(`Product added to favorites.`);
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
