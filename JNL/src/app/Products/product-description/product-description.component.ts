import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from 'src/app/_services';
import * as _ from 'lodash';
import { Product } from 'src/app/_models';

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
        this.productDesc = desc;
        this.getParts();
      });
  }

  getParts() {
    const partsList: any[] = [];
    this.productDesc.forEach(item => {
      if (item.partNameFr) { // check if is NULL or undefined
      partsList.push(item.partNameFr);
      }
    });
    this.parts = _.uniq(partsList);
  }

  getMaterials(part: string) {
    const matList: string[] = [];
    let mats = '';
    this.productDesc.forEach(item => {
      if (item.partNameFr === part) {
        matList.push(item.materialNameFr.toString());
      }
    });
    this.materials = _.uniq(matList);
    mats = this.materials.join(', ');
    return mats;
  }

  toggleElement() {
    this.toggle = !this.toggle;
  }

}

