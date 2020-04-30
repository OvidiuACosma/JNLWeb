import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, ProductsService } from '../../_services';
import { User, IProductReadyToSell, Browser, ProductEF, IProductToFavorites,
         IProductsFiltersCached, IFilterElements, IFilter} from '../../_models';
import * as _ from 'lodash';
import { accentFold } from '../../_helpers';
import { mergeMap, map } from 'rxjs/operators';

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

  products: IProductReadyToSell[];
  routeParams: IRouteParams;
  productsFiltered: IProductReadyToSell[];
  familiesFr: any;
  familiesEn: any;
  searchText = '';
  language: string;
  text: any;
  user: User;
  filterBy: string[] = ['Brand', 'Family'];
  brands = new Set(['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'JNL Studio']);
  filterElements: IFilterElements[] = [];
  browser: Browser;
  toggle: boolean[];
  productsFiltersCached: IProductsFiltersCached;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private dataex: DataExchangeService,
    private textService: TranslationService,
    private productService: ProductsService) { }

  ngOnInit() {
    this.getData();
    this.toggle = this.filterBy.map(m => true);
  }

  getData() {
    this.dataex.currentUser.pipe(
      mergeMap(user => this.dataex.currentBrowser.pipe(
        mergeMap(_browser => this.dataex.currentLanguage.pipe(
          mergeMap(lang => this.textService.getTextFavorites().pipe(
            mergeMap(text => this.productService.getProductsReadyToSell(user.type || 'w').pipe( // concatMap
              mergeMap(products => this.dataex.currentProductsRtsFilters.pipe(
                map(pFilters => ({
                  user: user,
                  browser: _browser,
                  lang: lang,
                  text: text,
                  products: products,
                  pFilters: pFilters
                }))
              ))
            ))
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.user = resp.user;
      this.browser = resp.browser;
      this.language = resp.lang || 'EN';
      this.text = resp.text[0][this.language.toUpperCase()];
      this.products = resp.products;
      this.filterBrands(this.products);
      this.productsFiltered = _.clone(this.products);
      this.getFamilies();
      this.getRouteParameters();
      this.setFilterElements();
      this.productsFiltersCached = resp.pFilters;
      this.applyFiltersCached(resp.pFilters);
    });
  }

  filterBrands(products: IProductReadyToSell[]) {
    const productsBrands = _.uniq(products.map(m => m.brand));
    this.brands.forEach(element => {
      if (!productsBrands.includes(element)) {
        this.brands.delete(element);
      }
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
    this.filterElements = this.filterBy.map(m => {
      return {
        filterGroup: m,
        filterElement: this.getFilterElements(m)
      };
    });
  }

  getFilterElements(filterGroup: string): IFilter[] {
    switch (filterGroup) {
      case 'Brand': { return this.setFilterListFromSet(this.brands); }
      case 'Family': {
        switch (this.language?.toLowerCase()) {
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

  applyFiltersCached(productsFiltersCached: IProductsFiltersCached) {
    if (_.filter(productsFiltersCached.filteredItems, value => value).length) {
      this.updateFilterElementsFromCache(productsFiltersCached.filteredElements);
      this.selectFilter('', '', true);
    }
    if (productsFiltersCached.searchText !== '') {
      this.searchText = productsFiltersCached.searchText;
      this.searchByText();
    }
  }

  updateFilterElementsFromCache(filteredElementsCached: IFilterElements[]) {
    filteredElementsCached.forEach(element => {
      element.filterElement.forEach(fe => {
        this.filterElements.find(f => f.filterGroup === element.filterGroup).filterElement
                           .find(f => f.displayName === fe.displayName).checked = fe.checked;
      });
    });
  }

  getFilters(category: string): IFilter[] {
      const fe: IFilterElements[] = _.filter(this.filterElements, { 'filterGroup': category });
      if (!fe[0]) { return;  }
      let fg: IFilter[] = fe[0].filterElement;
      switch (category) {
        case 'Family': {
          switch (this.language?.toLowerCase()) {
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
    this.searchText = '';
    this.getFamilies(['all']);
    this.setFilterElements();
    this.productsFiltered = _.clone(this.products);
  }

  selectFilter(c = '', displayName = '', fromCached = false) {
    this.scrollAfterFilter('content');
    let filteredElements: IFilterElements[];
    let filterItems: number[];
    let filteredItems: boolean[];

    this.toggleSelection(c, displayName);

    // Determine filtering parameters
    filteredElements = _.cloneDeep(this.filterElements);
    _.map(filteredElements, element => {
      element.filterElement = _.filter(element.filterElement, { 'checked': true });
      return element;
    });
    filterItems = this.getFilterItems();
    filteredItems = this.getFilteredItems(filteredElements, filterItems);
    this.applyFilters(filteredItems, filteredElements);
    if (this.searchText !== '') { this.searchByText(); }
    if (!fromCached) {
      this.cacheFilters(this.searchText, filteredItems, filteredElements);
    }
  }

  toggleSelection(c: string, displayName: string) {
    if (c !== '') {
      this.toggleItemSelection(c, displayName);
      if (c === 'Brand') {
        this.resetFamilies();
      }
    }
  }

  toggleItemSelection(c: string, displayName: string) {
    this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.displayName === displayName).checked =
      !this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.displayName === displayName).checked;
  }

  cacheFilters(searchText: string, filteredItems: boolean[], filteredElements: IFilterElements[]) {
    this.productsFiltersCached = {
      searchText: searchText,
      filteredItems: filteredItems,
      filteredElements: filteredElements};
    this.dataex.setProductsRtsFilters(this.productsFiltersCached);
  }

  resetFamilies() {
    this.getFamilies(this.getselectedItemsOfGroup('Brand'));
  }

  getselectedItemsOfGroup(group: string): string[] {
    let selectedItems: string[] = this.filterElements.find(f => f.filterGroup === group)
      .filterElement.filter(v => v.checked).map(m => m.displayName);
    if (selectedItems?.length === 0) { selectedItems = ['all']; }
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
    return this.filterElements.map(m => m.filterElement?.length);
  }

  getFilteredItems(filteredElements: IFilterElements[], filterItems: number[]): boolean[] {
    const filteredItems: boolean[] = [];
    for (let j = 0; j < filteredElements?.length; j++) {
      if ((filteredElements[j].filterElement?.length %
        (filterItems[j] || filteredElements[j].filterElement?.length)) === 0) {
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
    for (let l = 0; l < filteredItems?.length; l++) {
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
        accentFold(f.brand?.toLowerCase()).includes(searchText) ||
        accentFold(f.familyEn?.toLowerCase()).includes(searchText) ||
        accentFold(f.familyFr?.toLowerCase()).includes(searchText) ||
        accentFold(f.model?.toLowerCase()).includes(searchText)
      );
      this.cacheFilters(searchText, this.productsFiltersCached.filteredItems, this.productsFiltersCached.filteredElements);
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
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  toggleFilters(index: number) {
    this.toggle[index] = !this.toggle[index];
  }

  getArrow(i: number): string {
    if (this.toggle[i]) {
      return 'assets/Images/Common/arrow_up_gold.png';
    }
    return 'assets/Images/Common/arrow_down_gold.png';
  }

  getFamiliesGroup(): any {
    switch (this.language?.toLowerCase()) {
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
    switch (this.language?.toLowerCase()) {
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
    switch (this.language?.toLowerCase()) {
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

  addToFavorites(product: ProductEF) {
    const productToFavorites: IProductToFavorites = this.productService.getProductToFavorites(product, this.language, 4);
    this.productService.addToFavorites(productToFavorites, this.user);
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
