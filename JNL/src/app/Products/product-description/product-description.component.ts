import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from 'src/app/_services';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})
export class ProductDescriptionComponent implements OnInit {

  @Input() prodCode = '';
  public productDesc: any[];
  public parts: string[];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getProductDesc(this.prodCode)
      .subscribe(desc => {
        this.productDesc = desc;
      });
  }
}

