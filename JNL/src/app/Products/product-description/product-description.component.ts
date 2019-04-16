import { Component, OnInit, Input } from '@angular/core';
import { DataExchangeService, TranslationService, ProductsService } from '../../_services';
// import * as _ from 'lodash';
import { Product } from '../../_models';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})
export class ProductDescriptionComponent implements OnInit {

  @Input() product: Product;
  public productDesc: any[];
  public parts = new Set();
  public materials: string[] = [];
  toggle = false;
  language: string;
  stdText: any;

  constructor(private dataex: DataExchangeService,
    private textService: TranslationService,
    private productsService: ProductsService) { }

  ngOnInit() {

    this.dataex.currentLanguage
      .subscribe(lang => {
        this.language = lang || 'EN';
        this.getStdText(this.language);

        this.productsService.getProductDesc(this.product)
          .subscribe(desc => {
            this.productDesc = desc.sort(function (a, b) {
              if (a.orderIndex > b.orderIndex) { return -1; }
              if (a.orderIndex < b.orderIndex) { return 1; }
              return 0;
            });
            this.getParts();
          });

      });
  }

  getStdText(lang: string) {
    this.textService.getTextProductStandard()
      .subscribe(data => {
        const resources = data[0];
        this.stdText = resources[lang.toUpperCase()];
      });
  }

  getParts() {
    switch (this.language.toLowerCase()) {
      case 'fr': {
        this.parts = new Set(this.productDesc.map(m => m.partNameFr));
        break;
      }
      case 'en': {
        this.parts = new Set(this.productDesc.map(m => m.partNameEn));
        break;
      }
    }
  }

  getMaterials(part: string) {
    let matList = new Set();
    switch (this.language.toLowerCase()) {
      case 'fr': {
        matList = new Set(this.productDesc.filter(f => f.partNameFr === part)
          .map(m => m.materialNameFr));
        break;
      }
      case 'en': {
        matList = new Set(this.productDesc.filter(f => f.partNameEn === part)
          .map(m => m.materialNameEn));
        break;
      }
    }
    return matList;
    // const matList: string[] = [];
    // this.productDesc.forEach(item => {
    // if (item.partNameFr === part) {
    //  matList.push((item.materialNameFr || '').toString());
    // }
    // });
    // this.materials = _.uniq(matList);
    // if (this.materials.length > 0) {
    // const mats =  this.materials.join(', ');
    // return mats;
    // } else { return ''; }
  }

  getFinitions(part: string, material: string) {
    let finList = new Set();
    switch (this.language.toLowerCase()) {
      case 'fr': {
        finList = new Set(this.productDesc.filter(f => f.partNameFr === part && f.materialNameFr === material)
          .map(c => c.finisageNameFr));
        break;
      }
      case 'en': {
        finList = new Set(this.productDesc.filter(f => f.partNameEn === part && f.materialNameEn === material)
          .map(c => c.finisageNameEn));
      }
    }
    return finList;
  }

  toggleElement() {
    this.toggle = !this.toggle;
  }

}

