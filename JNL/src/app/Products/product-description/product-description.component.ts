import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from '../../_services';
import * as _ from 'lodash';
import { Product } from '../../_models';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})
export class ProductDescriptionComponent implements OnInit {

  @Input() product: Product;
  public productDesc: any[];
  public parts: string[] = [];
  public materials: string[] = [];
  toggle = false;

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getProductDesc(this.product)
      .subscribe(desc => {
        this.productDesc = desc.sort(function(a, b) {
          if (a.orderIndex > b.orderIndex) { return -1; }
          if (a.orderIndex < b.orderIndex) { return 1; }
          return 0;
        });
        this.getParts();
      });
  }

  getParts() {
    const partsList: any[] = [];
    this.productDesc.forEach(item => {
      if (item.partNameFr) {
        partsList.push(item.partNameFr);
      }
    });
    this.parts = _.uniq(partsList);
  }

  getMaterials(part: string) {
    const matList = new Set(this.productDesc.filter(f => f.partNameFr === part)
      .map(m => m.materialNameFr));
      return matList;
    // const matList: string[] = [];
    // this.productDesc.forEach(item => {
    //   if (item.partNameFr === part) {
    //     matList.push((item.materialNameFr || '').toString());
    //   }
    // });
    // this.materials = _.uniq(matList);
    // if (this.materials.length > 0) {
    //   const mats =  this.materials.join(', ');
    //   return mats;
    // } else { return ''; }
  }

  getFinitions(part: string, material: string) {
    const finList = new Set(this.productDesc.filter(f => f.partNameFr === part && f.materialNameFr === material)
        .map(c => c.finisageNameFr));
    return finList;
  }

  toggleElement() {
    this.toggle = !this.toggle;
  }

}

