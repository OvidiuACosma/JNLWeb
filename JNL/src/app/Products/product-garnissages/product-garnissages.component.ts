import { Component, OnInit } from '@angular/core';
import { ProductsService, DataExchangeService } from 'src/app/_services';
import { IGarnissage } from 'src/app/_models';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ProductGarnissageDetailsComponent } from '../product-garnissage-details/product-garnissage-details.component';
import { map } from 'rxjs/operators';

interface IFilter {
  index: number;
  checked: boolean;
  displayName: string;
}

interface IFilterElements {
  filterGroup: string;
  filterElement: IFilter[];
}

interface IProdGarnissage {
  codeProd: string;
  material: string;
  model: string;
  dimensions: string;
  composition: string;
  martindale: string;
  type: string;
  brand: string;
  color: string;
  colorRef: string;
}

@Component({
  selector: 'app-product-garnissages',
  templateUrl: './product-garnissages.component.html',
  styleUrls: ['./product-garnissages.component.css']
})
export class ProductGarnissagesComponent implements OnInit {

  language: string;
  products: IProdGarnissage[];
  productsFiltered: IProdGarnissage[];
  toggle: boolean[];
  filterBy: string[] = ['Color', 'Material', 'Type', 'Brand'];
  brands = new Set(['JNL Collection', 'Ungaro Home']);
  color: any;
  material: any;
  type: any;
  filterElements: IFilterElements[] = [];


  constructor(private productService: ProductsService,
              private dataex: DataExchangeService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.dataex.currentLanguage
    .subscribe(lang => {
    this.language = lang || 'EN';
      this.productService.getGarnissages()
      .subscribe(res => {
        this.products = this.mapProducts(res, lang);
        this.products = this.sortProducts(this.products);
        this.productsFiltered = _.cloneDeep(this.products);
        this.getColors(); // p.categories
        this.getMaterials(); // p.families
        this.getTypes();
        this.setFilterElements();
        // this.getFilters(res);
      });
    });
    this.toggle = new Array(this.filterBy.length);
    for (let i = 0; i < this.filterBy.length; i++) {
      this.toggle[i] = true;
    }
  }

  mapProducts(products: IGarnissage[], lang: string): IProdGarnissage[] {
    let productsMapped: IProdGarnissage[];
    switch (lang.toLowerCase()) {
      case 'en': {
        productsMapped = products.map(m => {
          return {
            codeProd: m.codeProd,
            material: m.materialEn,
            model: m.model,
            dimensions: m.dimensions,
            composition: m.compositionEn,
            martindale: m.martindale,
            type: this.getTypeStringFromBoolean(m.gaCoussinOnly, lang),
            brand: this.getBrandStringFromNumeric(m.brand),
            color: m.colorEn,
            colorRef: m.colorRef
          };
        });
        break;
      }
      case 'fr': {
        productsMapped = products.map(m => {
          return {
            codeProd: m.codeProd,
            material: m.materialFr,
            model: m.model,
            dimensions: m.dimensions,
            composition: m.compositionFr,
            martindale: m.martindale,
            type: this.getTypeStringFromBoolean(m.gaCoussinOnly, lang),
            brand: this.getBrandStringFromNumeric(m.brand),
            color: m.colorFr,
            colorRef: m.colorRef
          };
        });
      }
    }
    return productsMapped;
  }

  getTypeStringFromBoolean(t: boolean = false, lang: string): string {
    if (!!t) {
      switch (lang.toLowerCase()) {
        case 'en': {return 'Cushions only'; }
        case 'fr' : {return 'Coussins seulement'; }
      }
    } else {
      switch (lang.toLowerCase()) {
        case 'en': {return 'Upholstery'; }
        case 'fr' : {return 'Garnissage'; }
      }
    }
  }

  getBrandStringFromNumeric(b: number): string {
    switch (b) {
      case 0: { return 'JNL Collection'; }
      case 1: { return 'Ungaro Home'; }
    }
  }

  sortProducts(p: IProdGarnissage[]): IProdGarnissage[] {
    // p.sort(function(a, b) {
    //   // if (a.familyFr.localeCompare(b.familyFr) > 0) { return 1; }
    //   // if (a.familyFr.localeCompare(b.familyFr) < 0) { return -1; }
    //   // if (a.brand.localeCompare(b.brand) > 0) { return 1; }
    //   // if (a.brand.localeCompare(b.brand) < 0) { return -1; }
    //   // if (a.model.localeCompare(b.model) > 0) { return 1; }
    //   // return -1;
    // });
    return p;
  }

  getColors(brand: string[] = ['all']) {
    let products = _.clone(this.products);
    if (!brand.includes('all')) {
      products = products.filter(f => brand.includes(f.brand));
    }
      this.color = new Set(products.map(c => c.color));
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

  // getFiltersLists(ga: IGarnissage[]) {
  //   let filter: any[];
  //   filter = ga.map(m => {
  //     return {
  //       color: m.colorEn
  //     };
  //   });
  //   this.filtersColorList = _.uniqBy(filter, 'color');
  //   filter = [];

  //   filter = ga.map(m => {
  //     return {
  //       material: m.materialEn
  //     };
  //   });
  //   this.filtersMaterialsList = _.uniqBy(filter, 'material');
  // }

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
    console.log('selectFilter(', c, ',', displayName);
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
    // if (this.searchText !== '') {
    //   this.searchByText();
    // }
    // this.scroller = false;
  }

  scrollAfterFilter(fragment: string) {
    // window.scrollTo(0, window.innerWidth / 100 * 9);
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
    console.log('filteredItems:', filteredItems, 'filteredElements:', filteredElements);
    let filterItemsList: string[] = [];
    this.productsFiltered = _.clone(this.products);
    for (let l = 0; l < filteredItems.length; l++) {
      if (filteredItems[l]) {
        filterItemsList = this.getListOfFilterItems(filteredElements[l].filterElement);
        switch (l) {
          case 0: {
            this.productsFiltered = this.productsFiltered.filter(f => filterItemsList.includes(f.color));
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw';
    dialogConfig.maxWidth = '960px';
    // dialogConfig.maxHeight = '825px';
    dialogConfig.data = garn;
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(ProductGarnissageDetailsComponent, dialogConfig);

    return dialogRef.afterClosed()
    .pipe(
      map(result => {
      return result;
    }));
  }
}
