import { Component, OnInit, Input} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-dimensions',
  templateUrl: './product-dimensions.component.html',
  styleUrls: ['./product-dimensions.component.css']
})
export class ProductDimensionsComponent implements OnInit {

  toggle = false;

  constructor() { }

  ngOnInit() {
  }

  toggleElement() {
    this.toggle = !this.toggle;
  }

}
