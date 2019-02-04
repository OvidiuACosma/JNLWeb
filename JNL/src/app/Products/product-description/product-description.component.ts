import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/_services';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})
export class ProductDescriptionComponent implements OnInit {

  public product: string;
  public productDesc: any[];
  public productID = 'MEDD01';
  public parts: string[];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getProductDesc(this.productID)
      .subscribe(desc => {
        this.productDesc = desc;
        // console.log('DESC:', this.productDesc[0].familyFr);
      });
  }
}

