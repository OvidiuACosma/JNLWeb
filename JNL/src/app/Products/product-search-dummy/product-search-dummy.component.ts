import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { IFilter, IFilterElements, IProductsFiltersCached, ProductEF } from 'src/app/_models';
import { DataExchangeService, ProductsService } from 'src/app/_services';
import { map, mergeMap, takeUntil } from 'rxjs/operators';

interface IRouteParams {
  brand: string;
  category: string;
  family: string;
  model: string;
  searchText: string;
}

@Component({
  selector: 'app-product-search-dummy',
  templateUrl: './product-search-dummy.component.html',
  styleUrls: ['./product-search-dummy.component.scss']
})
export class ProductSearchDummyComponent implements OnInit, OnDestroy {

  routeParams: IRouteParams;
  unsubscriber = new Subject();
  subscription: Subscription;
  products: ProductEF[];
  categoriesFr: any;
  categoriesEn: any;
  familiesFr: any;
  familiesEn: any;
  searchText = '';
  language: string;
  filterElements: IFilterElements[] = [];
  productsFiltersCached: IProductsFiltersCached;
  filterCategories: string[] = ['Brand', 'Type', 'Family'];
  brands = new Set(['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'JNL Studio']);

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private productsService: ProductsService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy():void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  getData(): void {
    this.subscription = this.dataex.currentLanguage.pipe(
      mergeMap(lang => this.productsService.getProducts().pipe(
        mergeMap(products => this.route.paramMap.pipe(
          map(params => ({
            lang: lang,
            products: products,
            params: params
          }))
        ))
      ))
    )
    .pipe(takeUntil(this.unsubscriber))
    .subscribe(resp => {
      this.language = resp.lang || 'EN';
      this.products = this.sortProducts(resp.products);
      this.setFilterElements();
      this.routeParams = this.getRouteParameters(resp.params);
      if (this.routerParametersExist(this.routeParams)) {
        this.applyRouteParamsToFilters(this.routeParams);
      }
      this.cacheFilters();
      this.navigateProductSearch();
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

  getRouteParameters(params: any): IRouteParams {
    const routeParams = { brand: params.get('b'),
                          category: params.get('c'),
                          family: params.get('f'),
                          model: params.get('m'),
                          searchText: params.get('s')
    };
    return routeParams;
  }

  routerParametersExist(params: IRouteParams): boolean {
    if (params.brand || params.category || params.family || params.model || params.searchText) {
      return true;
    }
    return false;
  }

  applyRouteParamsToFilters(params: IRouteParams) {
    if (params.searchText) {
      this.searchText = params.searchText;
    }
    if (params.brand) {
      this.activateElementSelection('Brand', params.brand);
    }
    if (params.category) {
      this.activateElementSelection('Type', params.category);
    }
    if (params.family) {
      this.activateElementSelection('Family', params.family);
    }
  }

  activateElementSelection(group: string, param: string) {
    this.filterElements.find(f => f.filterGroup === group)
    .filterElement.find(f => f.displayName === param).checked = true;
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

  getFilterItems(): number[] {
    const filterItems: number[] = [];
    if (this.filterElements) {
      for (let k = 0; k < this.filterElements.length; k++) {
        filterItems.push(this.filterElements[k].filterElement.length);
      }
    }
    return filterItems;
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

  navigateProductSearch(): void {
    this.router.navigate(['product/productSearch']);
  }
}
