import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, ProductsService } from '../../_services';
import { Product, ProductEF } from '../../_models';
import * as _ from 'lodash';

interface IFilter {
  index: number;
  checked: boolean;
  displayName: string;
}

interface IFilterElements {
  filterGroup: string;
  filterElement: IFilter[];
}

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
  public familiesFr: any;
  public familiesEn: any;
  public product: string; // TODO: kill it when killing the search button
  language: string;
  text: any;
  filterBy: string[] = ['Brand', 'Type', 'Family'];
  brands = new Set(['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'LUZ Interiors']);
  filterElements: IFilterElements[] = [];
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
        this.products = this.sortProducts(p);
        this.productsFiltered = _.clone(this.products);
        this.categoriesFr = new Set(this.products.map(c => c.categoryFr));
        this.categoriesEn = new Set(this.products.map(c => c.categoryEn));
        this.familiesFr = new Set(this.products.map(f => f.familyFr));
        this.familiesEn = new Set(this.products.map(f => f.familyEn));
        this.setFilterElements();
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

  setFilterElements() {
    this.filterElements = [];
    for (const f of this.filterBy) {
      this.filterElements.push({filterGroup: f,
        filterElement: this.getFilterElements(f)
      });
    }
  }

  getFilterElements(filterGroup: string): IFilter[] {
    switch (filterGroup) {
      case 'Brand': { return this.setFilterListFromSet(this.brands); }
      case 'Type': {
        switch (this.language.toLowerCase()) {
          case 'fr': { return this.setFilterListFromSet(this.categoriesFr); }
          case 'en': { return this.setFilterListFromSet(this.categoriesEn); }
        }
        break;
      }
      case 'Family': {
        switch (this.language.toLowerCase()) {
          case 'fr': { return this.setFilterListFromSet(this.familiesFr); }
          case 'en': { return this.setFilterListFromSet(this.familiesEn); }
        }
        break;
      }
    }
    return [];
  }

  setFilterListFromSet(set: Set<string>): IFilter[] {
    const filter: IFilter[] = [];
    let i = 0;
    set.forEach((value: string) => {
      filter.push({index: i, checked: false, displayName: value});
      i++;
    });
    return filter;
  }

  sortProducts(p: ProductEF[]): ProductEF[] {
    p.sort(function(a, b) {
      if (a.familyFr.localeCompare(b.familyFr) > 0) { return 1; }
      if (a.familyFr.localeCompare(b.familyFr) < 0) { return -1; }
      if (a.brand.localeCompare(b.brand) > 0) { return 1; }
      if (a.brand.localeCompare(b.brand) < 0) { return -1; }
      if (a.model.localeCompare(b.model) > 0) { return 1; }
      return -1;
    });
    return p;
  }

  getFilters(category: string): any {
      const fe: IFilterElements[] = this.filterElements.filter(f => f.filterGroup === category);
      const fg: IFilter[] = fe[0].filterElement;
      return  fg;
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

  // TODO: CHANGE function for FAV
  removeItem(index: number) {
    this.scroller = false;
    this.total--;
    // TODO: REMOVE FROM DB ?
  }

  selectFilter(c: string, i: number) {
    let filteredElements: IFilterElements[];
    const filterItems: number[] = [];
    const filteredItems: boolean[] = [];
    let filterItemsList: string[] = [];
    this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.index === i).checked =
      !this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.index === i).checked;

    filteredElements = _.cloneDeep(this.filterElements);

    _.map(filteredElements, element => {
      element.filterElement = _.filter(element.filterElement, fe => fe.checked);
      return element;
    });

    for (let k = 0; k < this.filterElements.length; k++) {
      filterItems.push(this.filterElements[k].filterElement.length);
    }
    for (let j = 0; j < filteredElements.length; j++) {
      if ((filteredElements[j].filterElement.length %
        (filterItems[j] || filteredElements[j].filterElement.length)) === 0) {
          filteredItems.push(false);
        } else {
          filteredItems.push(true);
        }
    }

    this.productsFiltered = _.clone(this.products);
    for (let l = 0; l < filteredItems.length; l++) {
      if (filteredItems[l]) {
        filterItemsList = this.getListOfFilterItems(filteredElements[l].filterElement);
        switch (l) {
          case 0: {
            this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.brand));
            break;
          }
          case 1: {
            switch (this.language) {
              case 'EN': {
                this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.categoryEn));
                break;
              }
              case 'FR': {
                this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.categoryFr));
                break;
              }
            }
            break;
          }
          case 2: {
            switch (this.language) {
              case 'EN': {
                this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.familyEn));
                break;
              }
              case 'FR': {
                this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.familyFr));
                break;
              }
            }
            break;
          }
        }
      }
    }

    this.scroller = false;
  }

  getListOfFilterItems(filteredElements: IFilter[]): string[] {
    const filterList: string[] = [];
      for (const f of filteredElements) {
        filterList.push(f.displayName);
      }
    return filterList;
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
