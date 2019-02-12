import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from 'src/app/_services';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})
export class ProductDescriptionComponent implements OnInit {

  @Input() prodCode = '';
  public productDesc: any[];
  public parts: string[] = [];
  public materials: string[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getProductDesc(this.prodCode)
      .subscribe(desc => {
        this.productDesc = desc;
        this.getParts();
      });
  }

  getParts() {
    const partsList: any[] = [];
    this.productDesc.forEach(item => {
      partsList.push(item.partNameFr.toString());
    });
    this.parts = _.uniq(partsList);
  }

  getMaterials(part: string) {
    // console.log('PART: ', part);
    const matList: string[] = [];
    this.productDesc.forEach(item => {
      if (item.partNameFr === part) {
        matList.push(item.materialNameFr.toString());
      }
    });
    this.materials = _.uniq(matList);
    // console.log('MATERIALS: ', this.materials);
    return this.materials;
  }
}

