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
  // public item = 0;
  public index = -1;

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
}

