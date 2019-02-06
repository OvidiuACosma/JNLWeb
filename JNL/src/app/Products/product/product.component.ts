import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/_services';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public detail = 'description';
  public product_id: string;
  public prodDesc: any;
  public family = '';
  public prodName = '';
  public tabList: string[] = ['description', 'matFin', 'dimensions', 'catalogues', 'pdf'];

  constructor(private activatedRoute: ActivatedRoute,
              private productsService: ProductsService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.product_id = paramsId.product;
      this.getProductData(paramsId.product);
      });
    }

    getProductData(productID: string) {
    this.productsService.getProduct(productID)
      .subscribe(desc => {
        this.prodDesc = desc;
        this.family = this.prodDesc.familyFr.replace(/\s/g , '');
        this.prodName = this.prodDesc.model.replace(/\s/g , '');
         console.log('DESC:', this.prodDesc);
      });
    }

  setDetail(index: number) {
    this.detail = this.tabList[index];
  }

}
