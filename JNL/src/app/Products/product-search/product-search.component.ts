import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DataExchangeService, TranslationService, ProductsService } from '../../_services';
import { ProductEF, User } from '../../_models';
import * as _ from 'lodash';
import { accentFold } from '../../_helpers';
import { MatDialog } from '@angular/material/dialog';

interface IFilter {
  index: number;
  checked: boolean;
  displayName: string;
}

interface IFilterElements {
  filterGroup: string;
  filterElement: IFilter[];
}

interface IRouteParams {
  brand: string;
  category: string;
  family: string;
  model: string;
  searchText: string;
}

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html'
})

export class ProductSearchComponent implements OnInit {

  public routeParams: IRouteParams;
  public products: ProductEF[];
  public productsFiltered: ProductEF[];
  public categoriesFr: any;
  public categoriesEn: any;
  public familiesFr: any;
  public familiesEn: any;
  public searchText = '';
  language: string;
  text: any;
  user: User;
  filterBy: string[] = ['Brand', 'Type', 'Family'];
  brands = new Set(['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'JNL Studio']);
  filterElements: IFilterElements[] = [];
  scroller = true;
  numbers: number[] = [];
  total: number;

  toggle: boolean[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private productService: ProductsService,
              private dialog: MatDialog) {
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.dataex.currentLanguage
      .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);

      this.productService.getProducts()
      .subscribe(p => {
        this.products = this.sortProducts(p);
        this.productsFiltered = _.clone(this.products);
        this.getCategories();
        this.getFamilies();
        this.getRouteParameters();
        this.setFilterElements();
        if (this.routeParams.brand || this.routeParams.category || this.routeParams.family ||
            this.routeParams.model || this.routeParams.searchText) {
          this.activateItemSelection(this.routeParams);
          this.selectFilter();
        }
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
    this.getUser();
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

  getUser() {
    this.dataex.currentUser.subscribe( user => {
      this.user = user;
    });
  }

  getCategories(brand: string[] = ['all']) {
    let products = _.clone(this.products);
    if (!brand.includes('all')) {
      products = products.filter(f => brand.includes(f.brand));
    }
      this.categoriesFr = new Set(products.map(c => c.categoryFr));
      this.categoriesEn = new Set(products.map(c => c.categoryEn));
  }

  getFamilies(brand: string[] = ['all'], category: string[] = ['all']) {
    let products = _.clone(this.products);
    if (!brand.includes('all')) {
      products = products.filter(f => brand.includes(f.brand));
    }
    if (!category.includes('all')) {
      switch (this.language.toLowerCase()) {
        case 'en': {
          products = products.filter(f => category.includes(f.categoryEn));
          break;
        }
        case 'fr': {
          products = products.filter(f => category.includes(f.categoryFr));
        }
      }
    }
    this.familiesFr = new Set(products.map(f => f.familyFr));
    this.familiesEn = new Set(products.map(f => f.familyEn));
  }

  getRouteParameters() {
    this.route.paramMap.subscribe(params => {
      this.routeParams = { brand: params.get('b'),
                      category: params.get('c'),
                      family: params.get('f'),
                      model: params.get('m'),
                      searchText: params.get('s')
      };
      this.searchText = this.routeParams.searchText || '';
    });
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
      if (a.indexFamily > b.indexFamily) {
        return 1; // reverse
      } else  if (a.indexFamily < b.indexFamily) {
        return -1; // preserve
      } else {
        if (a.indexBrand > b.indexBrand) {
          return 1; // reverse
          // return a.indexModel - b.indexModel;
        } else {
          return -1; // preserve
        }
      }
      return -1;

      // if (a.familyFr.localeCompare(b.familyFr) > 0) { return 1; }
      // if (a.familyFr.localeCompare(b.familyFr) < 0) { return -1; }
      // if (a.brand.localeCompare(b.brand) > 0) { return 1; }
      // if (a.brand.localeCompare(b.brand) < 0) { return -1; }
      // if (a.model.localeCompare(b.model) > 0) { return 1; }
      // return -1;
    });
    return p;
  }

  getFilters(category: string): any {
      const fe: IFilterElements[] = this.filterElements.filter(f => f.filterGroup === category);
      let fg: IFilter[] = fe[0].filterElement;
      switch (category) {
        case 'Type': {
          switch (this.language.toLowerCase()) {
            case 'en': {
              fg = fg.filter(f => this.categoriesEn.has(f.displayName));
              break;
            }
            case 'fr': {
              fg = fg.filter(f => this.categoriesFr.has(f.displayName));
            }
          }
          break;
        }
        case 'Family': {
          switch (this.language.toLowerCase()) {
            case 'en': {
              fg = fg.filter(f => this.familiesEn.has(f.displayName));
              break;
            }
            case 'fr': {
              fg = fg.filter(f => this.familiesFr.has(f.displayName));
            }
          }
          break;
        }
      }
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

  // TODO: CHANGE function for FAV
  removeItem(index: number) {
    this.scroller = false;
    this.total--;
    // TODO: REMOVE FROM DB ?
  }

  resetFilter() {
    this.getCategories(['all']);
    this.getFamilies(['all']);
    this.setFilterElements();
    this.productsFiltered = _.clone(this.products);
  }

  selectFilter(c = '', displayName = '') {
    this.scrollAfterFilter('content');
    let filteredElements: IFilterElements[];
    let filterItems: number[];
    let filteredItems: boolean[];

    this.toggleSelection(c, displayName);

    // Determine filtering parameters
    filteredElements = _.cloneDeep(this.filterElements);
    _.map(filteredElements, element => {
      element.filterElement = _.filter(element.filterElement, fe => fe.checked);
      return element;
    });
    filterItems = this.getFilterItems();
    filteredItems = this.getFilteredItems(filteredElements, filterItems);
    this.applyFilters(filteredItems, filteredElements);
    if (this.searchText !== '') {
      this.searchByText();
    }
    this.scroller = false;
  }

  toggleSelection(c: string, displayName: string) {
    if (c !== '') {
      this.toggleItemSelection(c, displayName);
      // filter the list of filter elements brand -> category -> familiy
      if (c === 'Brand') {
        this.resetCategories();
        this.resetFamilies();
      }
      if (c === 'Type') {
        this.resetFamilies();
      }
    }
  }

  toggleItemSelection(c: string, displayName: string) {
    this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.displayName === displayName).checked =
      !this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.displayName === displayName).checked;
  }

  resetCategories() {
    this.getCategories(this.getselectedItemsOfGroup('Brand'));
  }

  resetFamilies() {
    this.getFamilies(this.getselectedItemsOfGroup('Brand'), this.getselectedItemsOfGroup('Type'));
  }

  getselectedItemsOfGroup(group: string): string[] {
    let selectedItems: string[] = this.filterElements.find(f => f.filterGroup === group)
      .filterElement.filter(v => v.checked).map(m => m.displayName);
    if (selectedItems.length === 0) { selectedItems = ['all']; }
    return selectedItems;
  }

  activateItemSelection(routeParams: IRouteParams) {
    if (routeParams.brand) {
      this.activateElementSelection('Brand', routeParams.brand);
      this.resetCategories();
      this.resetFamilies();
    }
    if (routeParams.category) {
      this.activateElementSelection('Type', routeParams.category);
      this.resetFamilies();
    }
    if (routeParams.family) {
      this.activateElementSelection('Family', routeParams.family);
    }
    // filter the list of filters
  }

  activateElementSelection(group: string, param: string) {
    this.filterElements.find(f => f.filterGroup === group)
    .filterElement.find(f => f.displayName === param).checked = true;
  }

  getFilterItems(): number[] {
    const filterItems: number[] = [];
    for (let k = 0; k < this.filterElements.length; k++) {
      filterItems.push(this.filterElements[k].filterElement.length);
    }
    // console.log('filterItems: ', filterItems);
    return filterItems;
  }

  getFilteredItems(filteredElements: IFilterElements[], filterItems: number[]): boolean[] {
    const filteredItems: boolean[] = [];
    for (let j = 0; j < filteredElements.length; j++) {
      if ((filteredElements[j].filterElement.length %
        (filterItems[j] || filteredElements[j].filterElement.length)) === 0) {
          filteredItems.push(false);
        } else {
          filteredItems.push(true);
        }
    }
    return filteredItems;
  }

  applyFilters(filteredItems: boolean[], filteredElements: IFilterElements[]) {
    let filterItemsList: string[] = [];
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
  }

  searchByText() {
    const searchText = accentFold(this.searchText.toLowerCase());
    if (this.searchText !== '') {
      this.productsFiltered = this.productsFiltered.filter(f =>
        accentFold(f.brand.toLowerCase()).includes(searchText) ||
        accentFold(f.categoryEn.toLowerCase()).includes(searchText) ||
        accentFold(f.categoryFr.toLowerCase()).includes(searchText) ||
        accentFold(f.familyEn.toLowerCase()).includes(searchText) ||
        accentFold(f.familyFr.toLowerCase()).includes(searchText) ||
        accentFold(f.model.toLowerCase()).includes(searchText)
      );
    } else {
      this.selectFilter();
    }
    this.scrollAfterFilter('content');
  }

  getListOfFilterItems(filteredElements: IFilter[]): string[] {
    const filterList: string[] = [];
      for (const f of filteredElements) {
        filterList.push(f.displayName);
      }
    return filterList;
  }

  scrollAfterFilter(fragment: string) {
  // window.scrollTo(0, window.innerWidth / 100 * 9);
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
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

  getFamiliesGroup(): any {
    switch (this.language.toLowerCase()) {
      case 'fr': {
        return new Set(this.productsFiltered.map(f => f.familyFr));
      }
      case 'en': {
        return new Set(this.productsFiltered.map(f => f.familyEn));
      }
    }
  }

  getProductsOfFamily(family: string): ProductEF[] {
    let productsOfFamily: ProductEF[];
    switch (this.language.toLowerCase()) {
      case 'fr': {
        productsOfFamily = this.productsFiltered
        .filter(f => f.familyFr === family);
        break;
      }
      case 'en': {
        productsOfFamily = this.productsFiltered
        .filter(f => f.familyEn === family);
        break;
      }
    }
    productsOfFamily = _.sortBy(productsOfFamily, 'indexModel');
    return productsOfFamily;
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
    this.router.navigate(['product/product', {b: product.brand, f: product.familyFr, m: product.model}]);
    this.scrollTop();
  }

  addToFavorites(product: ProductEF) {
      if (this.productService.isLoggedIn()) {
        this.productService.openDialog(product, this.user);
      } else {
        this.productService.openLoginDialog().subscribe(answer => {
          if (answer) {
            this.productService.openDialog(product, this.user);
          } else {
            console.log('Not logged in. Can\'t add to favorites');
          }
        });
      }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
