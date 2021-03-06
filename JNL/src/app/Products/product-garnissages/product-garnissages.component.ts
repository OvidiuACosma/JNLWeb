import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProductsService, DataExchangeService } from 'src/app/_services';
import { IProdGarnissage, Browser, User, IFilterElements, IFilter, IGarnissageColors } from 'src/app/_models';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProductGarnissageDetailsComponent } from '../product-garnissage-details/product-garnissage-details.component';
import { UserService } from 'src/app/_services/user.service';


@Component({
  selector: 'app-product-garnissages',
  templateUrl: './product-garnissages.component.html',
  styleUrls: ['./product-garnissages.component.scss']
})

export class ProductGarnissagesComponent implements OnInit, OnDestroy {

  @Input() withTitle = true;
  language: string;
  products: IProdGarnissage[];
  productsFiltered: IProdGarnissage[];
  gaColors: IGarnissageColors[];
  toggle: boolean[];
  filterBy: string[] = ['Color', 'Material', 'Type', 'Brand'];
  brands = new Set(['JNL Collection', 'Ungaro Home']);
  color: any;
  material: any;
  type: any;
  filterElements: IFilterElements[] = [];
  browser: Browser;
  user: User;
  unsubscriber = new Subject();


  constructor(private productService: ProductsService,
              private dataex: DataExchangeService,
              private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.getData();
    this.toggle = new Array(this.filterBy.length);
    for (let i = 0; i < this.filterBy.length; i++) {
      this.toggle[i] = true;
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  getData() {
    this.dataex.currentUser.pipe(
      mergeMap(user => this.dataex.currentBrowser.pipe(
        mergeMap(_browser => this.dataex.currentLanguage.pipe(
          mergeMap(lang => this.productService.getGarnissages().pipe(
            mergeMap(product => this.productService.getGarnissagesColors().pipe(
              map(ga => ({
                user: user,
                browser: _browser,
                lang: lang,
                product: product,
                ga: ga
              }))
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
      this.gaColors = resp.ga;
      this.products = this.productService.mapProducts(resp.product, this.language, this.gaColors);
      this.products = this.sortProducts(this.products);
      this.productsFiltered = _.cloneDeep(this.products);
      this.getColors(); // p.categories
      this.getMaterials(); // p.families
      this.getTypes();
      this.setFilterElements();
    });
  }

  sortProducts(p: IProdGarnissage[]): IProdGarnissage[] {
    return p;
  }

  getColors(brand: string[] = ['all']) {
    let products = _.clone(this.products);
    if (!brand.includes('all')) {
      products = products.filter(f => brand.includes(f.brand));
    }
      // this.color = new Set(products.map(c => c.color));
      this.color = new Set([].concat(...products.map(c => c.gaColors)));
  }

  getMaterials(brand: string[] = ['all'], color: string[] = ['all']) {
    let products = _.clone(this.products);
    if (!brand.includes('all')) {
      products = products.filter(f => brand.includes(f.brand));
    }
    if (!color.includes('all')) {
      products = products.filter(f => color.includes(f.color));
    }
    this.material = new Set(products.map(f => f.material));
  }

  getTypes(brand: string[] = ['all'], color: string[] = ['all'], material: string[] = ['all']) {
    let products = _.clone(this.products);
    if (!brand.includes('all')) {
      products = products.filter(f => brand.includes(f.brand));
    }
    if (!color.includes('all')) {
      products = products.filter(f => color.includes(f.color));
    }
    if (!material.includes('all')) {
      products = products.filter(f => material.includes(f.material));
    }
    this.type = new Set(products.map(f => f.type));
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
      case 'Color': { return this.setFilterListFromSet(this.color); }
      case 'Material': { return this.setFilterListFromSet(this.material); }
      case 'Type': { return this.setFilterListFromSet(this.type); }
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

  filterByColor(color: string) {
    this.productsFiltered = this.products.filter(f => f.color === color);
  }

  filterByMaterial(material: string) {
    this.productsFiltered = this.products.filter(f => f.material === material);
  }

  filterByBrand(brand: string) {
    this.productsFiltered = this.products.filter(f => f.brand === brand);
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

  getFilters(category: string): any {
    const fe: IFilterElements[] = this.filterElements.filter(f => f.filterGroup === category);
    if (!fe[0]) { return; }
    let fg: IFilter[] = fe[0].filterElement;
    switch (category) {
      case 'Type': {
        fg = fg.filter(f => this.type.has(f.displayName));
        break;
      }
      case 'Color': {
        fg = fg.filter(f => this.color.has(f.displayName));
        break;
      }
      case 'Brand': {
        fg = fg.filter(f => this.brands.has(f.displayName));
        break;
      }
      case 'Material': {
        fg = fg.filter(f => this.material.has(f.displayName));
        break;
      }
    }
    return  fg;
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
  }

  scrollAfterFilter(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  toggleSelection(c: string, displayName: string) {
    if (c !== '') {
      this.toggleItemSelection(c, displayName);
      // filter the list of filter elements brand -> category -> familiy
      switch (c) {
        case 'Brand': {
          this.resetColors();
          this.resetMaterials();
          this.resetTypes();
          break;
        }
        case 'Color': {
          this.resetMaterials();
          this.resetTypes();
          break;
        }
        case 'Material': {
          this.resetColors();
          this.resetTypes();
          break;
        }
        case 'Type': {
          this.resetMaterials();
          this.resetColors();
          break;
        }
      }
    }
  }

  toggleItemSelection(c: string, displayName: string) {
    this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.displayName === displayName).checked =
      !this.filterElements.find(f => f.filterGroup === c).filterElement.find(f => f.displayName === displayName).checked;
  }

  getselectedItemsOfGroup(group: string): string[] {
    let selectedItems: string[] = this.filterElements.find(f => f.filterGroup === group)
      .filterElement.filter(v => v.checked).map(m => m.displayName);
    if (selectedItems.length === 0) { selectedItems = ['all']; }
    return selectedItems;
  }

  resetColors() {
    this.getColors(this.getselectedItemsOfGroup('Brand'));
  }

  resetMaterials() {
    this.getMaterials(this.getselectedItemsOfGroup('Brand'), this.getselectedItemsOfGroup('Type'));
  }

  resetTypes() {
    this.getTypes(this.getselectedItemsOfGroup('Brand'), this.getselectedItemsOfGroup('Color'),
          this.getselectedItemsOfGroup('Material'));
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
            // this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.color));
            this.productsFiltered = this.productsFiltered.filter(f => f.gaColors.some(c => filterItemsList.includes(c)));
            break;
          }
          case 1: {
            this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.material));
            break;
          }
          case 2: {
            this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.type));
            break;
          }
          case 3: {
            this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.brand));
            break;
          }
        }
      }
    }
  }

  getListOfFilterItems(filteredElements: IFilter[]): string[] {
    const filterList: string[] = [];
      for (const f of filteredElements) {
        filterList.push(f.displayName);
      }
    return filterList;
  }

  openDialog(garn: IProdGarnissage): Observable<boolean> {
    const dialogConfig = this.productService.getGarnissageDialogConfig(garn, 'ga', this.browser.isDesktopDevice);
    const dialogRef = this.dialog.open(ProductGarnissageDetailsComponent, dialogConfig);
    // console.log('GARN: ', garn);
    return dialogRef.afterClosed()
    .pipe(
      map(result => {
      return result;
    }));
  }
}
