import { Component, OnInit, Input } from '@angular/core';
import { DataExchangeService, TranslationService, ProductsService } from '../../_services';
import * as _ from 'lodash';
import { Product, Finisage } from '../../_models';

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
  public testErable = false;
  public showLevel = null;
  public finisage: any[];
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
    this.testErable = false; // testing...
    if (material === 'Erable' || material === 'Maple') { this.testErable = true; }

    const finList: Finisage[] = [];
    this.productDesc.forEach(item => {
      switch (this.language.toLowerCase()) {
        case 'fr': {
          if (item.partNameFr === part && item.materialNameFr === material) {
            finList.push({
              name: item.finisageNameFr,
              img: `${item.materialNameFr} ${item.finisageNameFr}.jpg`
            });
          }
          break;
        }
        case 'en': {
          if (item.partNameEn === part && item.materialNameEn === material) {
            finList.push({
              name: item.finisageNameEn,
              img: `${item.materialNameFr} ${item.finisageNameFr}.jpg`
            });
          }
        }
      }
    });
    return _.uniq(finList);
  }

  toggleFin(index: string) {
    if (this.isLevelShown(index)) {
      this.showLevel = null;
    } else {
      this.showLevel = index;
    }
  }

  isLevelShown(idx: string) {
    return this.showLevel === idx;
  }

  sendItemToModal(fin: any) {
    this.finisage = fin;
  }

  closeModal() {
    const modal = document.getElementById('finisageModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        document.getElementById('fin-img').click();
      }
    };
  }

  // for mobile
  toggleElement() {
    this.toggle = !this.toggle;
  }
}

