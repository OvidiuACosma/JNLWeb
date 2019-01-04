import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  public product: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  GoToProduct() {
    // console.log('Product: ', this.product);
    this.router.navigate(['product', {product: this.product}]);
  }

}
