import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService, ProductsService } from '../../_services';
import { ProductEF, User, IGarnissageDto, Browser, IProdGarnissage,
         IProductToFavorites, IFilterElements, IFilter,
         IProductsFiltersCached } from '../../_models';
import * as _ from 'lodash';
import { accentFold } from '../../_helpers';
import { mergeMap, map, takeUntil } from 'rxjs/operators';
import { ProductGarnissageDetailsComponent } from '../product-garnissage-details/product-garnissage-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})

export class ProductSearchComponent implements OnInit, OnDestroy {

  products: ProductEF[];
  productsFiltered: ProductEF[];
  categoriesFr: any;
  categoriesEn: any;
  familiesFr: any;
  familiesEn: any;
  searchText = '';
  language: string;
  text: any;
  user: User;
  filterCategories: string[] = ['Brand', 'Type', 'Family'];
  brands = new Set(['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'JNL Studio']);
  filterElements: IFilterElements[] = [];
  scroller = true;
  total: number;
  browser: Browser;
  toggle: boolean[];
  productsFiltersCached: IProductsFiltersCached;
  subscription: Subscription;
  unsubscriber = new Subject();

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private productService: ProductsService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getData();
    this.toggle = this.filterCategories.map(m => true);
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
    this.cacheFilters();
  }

  getData() {
    this.subscription = this.dataex.currentUser.pipe(
      mergeMap(user => this.dataex.currentBrowser.pipe(
        mergeMap(_browser => this.dataex.currentLanguage.pipe(
          mergeMap(lang => this.textService.getTextFavorites().pipe(
            mergeMap(text => this.productService.getProducts().pipe(
              mergeMap(products => this.dataex.currentProductsFilters.pipe(
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
    .pipe(takeUntil(this.unsubscriber))
    .subscribe(resp => {
      this.user = resp.user;
      this.browser = resp.browser;
      this.language = resp.lang || 'EN';
      this.text = resp.text[0][this.language.toUpperCase()];
      this.products = this.sortProducts(resp.products);
      this.productsFiltered = _.clone(this.products);
      this.setFilterElements();
      this.productsFiltersCached = resp.pFilters;
      this.searchText = this.productsFiltersCached.searchText || '';
      this.applyFiltersCached(this.productsFiltersCached);
    });
  }

  sortProducts(p: ProductEF[]): ProductEF[] {
    return _.sortBy(p, ['indexFamily', 'indexBrand'], ['asc', 'asc']);
  }

  setFilterElements() {
    this.getCategories(['all']);
    this.getFamilies(['all'], ['all']);
    this.searchText = '';
    this.filterElements = [];
    this.filterElements = this.filterCategories.map(m => {
      return {
        filterGroup: m,
        filterElement: this.getFilterElements(m)
      };
    });
  }

  getCategories(brand: string[] = ['all']) {
    let products = _.clone(this.products);
    if (!brand.includes('all')) {
      products = _.filter(products, f => brand.includes(f.brand));
    }
      this.categoriesFr = new Set(products.map(c => c.categoryFr));
      this.categoriesEn = new Set(products.map(c => c.categoryEn));
      // OVIDIU: add Garnissage / Upholstery, which will behave as a link, not as filter
      this.categoriesEn.add('Upholstery');
      this.categoriesFr.add('Garnissage');
  }

  getFamilies(brand: string[] = ['all'], category: string[] = ['all']) {
    let products = _.clone(this.products);
    if (!brand.includes('all')) {
      products = products.filter(f => brand.includes(f.brand));
    }
    if (!category.includes('all')) {
      switch (this.language) {
        case 'EN': {
          products = products.filter(f => category.includes(f.categoryEn));
          break;
        }
        case 'FR': {
          products = products.filter(f => category.includes(f.categoryFr));
        }
      }
    }
    this.familiesFr = new Set(products.map(f => f.familyFr));
    this.familiesEn = new Set(products.map(f => f.familyEn));
  }

  getFilterElements(filterGroup: string): IFilter[] {
    switch (filterGroup) {
      case 'Brand': { return this.setFilterListFromSet(this.brands); }
      case 'Type': {
        switch (this.language) {
          case 'FR': { return this.setFilterListFromSet(this.categoriesFr); }
          case 'EN': { return this.setFilterListFromSet(this.categoriesEn); }
        }
        break;
      }
      case 'Family': {
        switch (this.language) {
          case 'FR': { return this.setFilterListFromSet(this.familiesFr); }
          case 'EN': { return this.setFilterListFromSet(this.familiesEn); }
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
    this.updateFilterElementsFromCache(productsFiltersCached.filteredElements);
    this.toggleSelection('', '');
    this.selectFilter();
    this.resetCategories();
    this.resetFamilies();
  }

  updateFilterElementsFromCache(filteredElementsCached: IFilterElements[]) {
    filteredElementsCached.forEach(element => {
      element.filterElement.forEach(fe => {
        if (fe.checked) {
          this.filterElements.find(f => f.filterGroup === element.filterGroup).filterElement
                            .find(f => f.displayName === fe.displayName).checked = fe.checked;
        }
      });
    });
  }

  getFilters(category: string): IFilter[] {
    if (this.filterElements === undefined) { return; }
    const fe: IFilterElements[] = _.filter(this.filterElements, { 'filterGroup': category});
    if (!fe[0]) { return; }
    let fg: IFilter[] = fe[0].filterElement;
    switch (category) {
      case 'Type': {
        switch (this.language) {
          case 'EN': {
            fg = fg.filter(f => this.categoriesEn.has(f.displayName));
            break;
          }
          case 'FR': {
            fg = fg.filter(f => this.categoriesFr.has(f.displayName));
          }
        }
        break;
      }
      case 'Family': {
        switch (this.language) {
          case 'EN': {
            fg = fg.filter(f => this.familiesEn.has(f.displayName));
            break;
          }
          case 'FR': {
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
    this.getCategories(['all']);
    this.getFamilies(['all'], ['all']);
    this.setFilterElements();
    this.productsFiltered = _.clone(this.products);
  }

  selectFilter() {
    const filteredElements = this.getFilteredElements();
    this.applyFilters(this.getFilteredItems(filteredElements, this.getFilterItems()), filteredElements);
    this.searchByText();
  }

  filterItemChecked(c = '', displayName = '') {
    if (this.isGarnissage(c, displayName)) {
      this.router.navigate(['product/productGarnissages']);
    } else {
      this.toggleSelection(c, displayName);
      this.readjustOptionsFilters(c);
      this.selectFilter();
    }
  }

  isGarnissage(c: string, displayName: string): boolean {
    if (c.toLowerCase() === 'type' &&
        ['garnissage', 'upholstery'].includes(displayName.toLowerCase())) {
      return true;
    }
    return false;
  }

  toggleSelection(c: string, displayName: string) {
    if (c !== '') {
      this.toggleItemSelection(c, displayName);
    }
  }

  toggleItemSelection(c: string, displayName: string) {
    this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.displayName === displayName).checked =
      !this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.displayName === displayName).checked;
  }

  readjustOptionsFilters(c: string): void {
    if (c === 'Family') { return; }
    if (c === 'Brand') {
      this.resetCategories();
    }
    this.resetFamilies();
  }

  getFilteredElements(): IFilterElements[] {
    let filteredElements: IFilterElements[];
    filteredElements = _.cloneDeep(this.filterElements);
    _.map(filteredElements, element => {
      element.filterElement = _.filter(element.filterElement, fe => fe.checked);
      return element;
    });
    return filteredElements;
  }

  cacheFilters() {
    this.productsFiltersCached = {
      searchText: this.searchText,
      filteredItems: this.getFilteredItems(this.getFilteredElements(), this.getFilterItems()),
      filteredElements: this.getFilteredElements()};
    this.dataex.setProductsFilters(this.productsFiltersCached);
  }

  resetCategories() {
    this.getCategories(this.getselectedItemsOfGroup('Brand'));
  }

  resetFamilies() {
    this.getFamilies(this.getselectedItemsOfGroup('Brand'), this.getselectedItemsOfGroup('Type'));
  }

  getselectedItemsOfGroup(group: string): string[] {
    let selectedItems: string[] = _.find(this.filterElements, {filterGroup: group})
      .filterElement.filter(v => v.checked).map(m => m.displayName);
    if (selectedItems.length === 0) { selectedItems = ['all']; }
    return selectedItems;
  }

  getFilterItems(): number[] {
    const filterItems: number[] = [];
    if (this.filterElements) {
      for (let k = 0; k < this.filterElements.length; k++) {
        filterItems.push(this.filterElements[k].filterElement.length);
      }
    }
    return filterItems;
  }

  getFilteredItems(filteredElements: IFilterElements[], filterItems: number[]): boolean[] {
    const filteredItems: boolean[] = [];
    if (filteredElements) {

      for (let j = 0; j < filteredElements.length; j++) {
        if ((filteredElements[j].filterElement.length %
          (filterItems[j] || filteredElements[j].filterElement.length)) === 0) {
            filteredItems.push(false);
          } else {
            filteredItems.push(true);
          }
      }
    }
    return filteredItems;
  }

  applyFilters(filteredItems: boolean[], filteredElements: IFilterElements[]) {
    if (filteredItems?.length > 0) {
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
  }

  searchByText() {
    const searchText = accentFold(this.searchText.toLowerCase());
    this.productsFiltered = this.productsFiltered.filter(f =>
      accentFold(f.brand.toLowerCase()).includes(searchText) ||
      accentFold(f.categoryEn.toLowerCase()).includes(searchText) ||
      accentFold(f.categoryFr.toLowerCase()).includes(searchText) ||
      accentFold(f.familyEn.toLowerCase()).includes(searchText) ||
      accentFold(f.familyFr.toLowerCase()).includes(searchText) ||
      accentFold(f.model.toLowerCase()).includes(searchText)
    );
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
    switch (this.language) {
      case 'FR': {
        return new Set(this.productsFiltered.map(f => f.familyFr));
      }
      case 'EN': {
        return new Set(this.productsFiltered.map(f => f.familyEn));
      }
    }
  }

  getProductsOfFamily(family: string): ProductEF[] {
    let productsOfFamily: ProductEF[];
    switch (this.language) {
      case 'FR': {
        productsOfFamily = this.productsFiltered
        .filter(f => f.familyFr === family);
        break;
      }
      case 'EN': {
        productsOfFamily = this.productsFiltered
        .filter(f => f.familyEn === family);
        break;
      }
    }
    productsOfFamily = _.sortBy(productsOfFamily, 'indexModel');
    return productsOfFamily;
  }

  getProductImage(product: ProductEF): string {
    return `assets/Images/Products/${product.brand}/${product.familyFr}/Search/${product.model}.jpg`;
  }

  getProductName(product: ProductEF): string {
    let productName: string;
    switch (this.language) {
      case 'FR': {
        productName = product.familyFr;
        break;
      }
      case 'EN': {
        productName = product.familyEn;
        break;
      }
    }
    productName = `${productName} ${product.model}`;
    return productName;
  }

  goToProduct(product: ProductEF) {
    if (product.categoryFr.toLowerCase() === 'garnissage') {
      this.openGaDialog(product);
    } else {
      this.router.navigate(['product/product', {b: product.brand, f: product.familyFr, m: product.model}]);
      this.scrollTop();
    }
  }

  openGaDialog(product: ProductEF) {
    const garn: IGarnissageDto = {
      materialFr: product.familyFr,
      model: product.model
    };
    this.productService.getGarnissage(garn)
    .subscribe(resp => {
      const garnissage: IProdGarnissage = this.productService.mapProducts(resp, this.language)[0];
      // this.productService.openGarnissageDialog(garnissage, this.browser.isDesktopDevice);
      const dialogConfig = this.productService.getGarnissageDialogConfig(garnissage, 'ga', this.browser.isDesktopDevice);
      const dialogRef = this.dialog.open(ProductGarnissageDetailsComponent, dialogConfig);
      return dialogRef.afterClosed()
      .pipe(
        map(result => {
        return result;
      }));
    });
  }

  addToFavorites(product: ProductEF) {
    const productToFavorites: IProductToFavorites = this.productService.getProductToFavorites(product, this.language, 1);
    this.productService.addToFavorites(productToFavorites, this.user);
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
