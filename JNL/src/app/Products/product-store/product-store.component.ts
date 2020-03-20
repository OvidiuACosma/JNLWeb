import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DataExchangeService, TranslationService, ProductsService } from '../../_services';
import { User, IProductReadyToSell } from '../../_models';
import * as _ from 'lodash';
import { accentFold } from '../../_helpers';

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
  selector: 'app-product-store',
  templateUrl: './product-store.component.html',
  styleUrls: ['./product-store.component.scss']
})
export class ProductStoreComponent implements OnInit {
  public products: IProductReadyToSell[];
  public routeParams: IRouteParams;
  public productsFiltered: IProductReadyToSell[];
  public familiesFr: any;
  public familiesEn: any;
  public searchText = '';
  language: string;
  text: any;
  user: User;
  filterBy: string[] = ['Brand', 'Family'];
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
    private productService: ProductsService) { this.router.events.subscribe((e: any) => {
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

      this.productService.getProductsToSell()
      .subscribe(p => {
        this.products = p;
        this.productsFiltered = _.clone(this.products);
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

    getFamilies(brand: string[] = ['all']) {
    let products = _.clone(this.products);
    if (!brand.includes('all')) {
      products = products.filter(f => brand.includes(f.brand));
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
      // case 'Type': {
      //   switch (this.language.toLowerCase()) {
      //     case 'fr': { return this.setFilterListFromSet(this.categoriesFr); }
      //     case 'en': { return this.setFilterListFromSet(this.categoriesEn); }
      //   }
      //   break;
      // }
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

  getFilters(category: string): any {
      const fe: IFilterElements[] = this.filterElements.filter(f => f.filterGroup === category);
      let fg: IFilter[] = fe[0].filterElement;
      switch (category) {
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

  resetFilter() {
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

  resetFamilies() {
    this.getFamilies(this.getselectedItemsOfGroup('Brand'));
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
          // case 1: {
          //   switch (this.language) {
          //     case 'EN': {
          //       this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.categoryEn));
          //       break;
          //     }
          //     case 'FR': {
          //       this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.categoryFr));
          //       break;
          //     }
          //   }
          //   break;
          // }
          case 1: {
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

  getProductsOfFamily(family: string): IProductReadyToSell[] {
    let productsOfFamily: IProductReadyToSell[];
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

  getProductImage(product: IProductReadyToSell): string {
    const src = `assets/Images/Products/Ready To Sell/${product.brand}/${product.familyFr}/Search/${product.id}.jpg`;
    return src;
  }

  getProductName(product: IProductReadyToSell): string {
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

  goToProduct(product: IProductReadyToSell) {
    this.router.navigate(['product/productStoreItem', {id: product.id}]);
    this.scrollTop();
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
