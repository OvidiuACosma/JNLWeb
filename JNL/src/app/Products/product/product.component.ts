import { Component, OnInit } from '@angular/core';
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
  public imgName: any;
  public tabList: string[] = ['description', 'matFin', 'dimensions', 'catalogues', 'pdf'];

  constructor(private activatedRoute: ActivatedRoute,
              private productsService: ProductsService) { }

  ngOnInit() {
    // this.product_id = 'CAMO01';
    this.activatedRoute.params.subscribe(paramsId => {
      this.product_id = paramsId.product;
      this.getProductData(paramsId.product);
      this.getImage();
      });
    }

    getProductData(productID: string) {
    this.productsService.getProduct(this.product_id)
      .subscribe(desc => {
        this.prodDesc = desc;
        // console.log('DESC:', desc);
      });
    }

    getImage() {
      // this.imgName = this.prodDesc.model;
      console.log('IMG NAME: ', this.product_id);
    }

  setDetail(index: number) {
    this.detail = this.tabList[index];
  }

}
