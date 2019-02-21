import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-product-catalogues',
  templateUrl: './product-catalogues.component.html',
  styleUrls: ['./product-catalogues.component.css']
})
export class ProductCataloguesComponent implements OnInit {

  toggleCatalogues = false;

  constructor() { }

  ngOnInit() {
  }

  toggleElement() {
    this.toggleCatalogues = !this.toggleCatalogues;
    console.log(this.toggleCatalogues);
  }

}
