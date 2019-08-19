import { Component, OnInit } from '@angular/core';
import { ProductsService, DataExchangeService } from 'src/app/_services';
import { IGarnissage } from 'src/app/_models';
import * as _ from 'lodash';
import { getRtlScrollAxisType } from '@angular/cdk/platform';

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
              private dataex: DataExchangeService) { }

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
        // this.getTypes();
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
            type: this.getTypeStringFromBoolean(m.gACoussinOnly, lang),
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
            type: this.getTypeStringFromBoolean(m.gACoussinOnly, lang),
            brand: this.getBrandStringFromNumeric(m.brand),
            color: m.colorFr,
            colorRef: m.colorRef
          };
        });
      }
    }
    return productsMapped;
  }

  getTypeStringFromBoolean(t: boolean, lang: string): string {
    if (!!t) {
      switch (lang) {
        case 'en': {return 'Cushions only'; }
        case 'fr' : {return 'Coussins seulement'; }
      }
    } else {
      switch (lang) {
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
      case 'Type': { return this.setFilterListFromSet(this.typeFr); }
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
}
