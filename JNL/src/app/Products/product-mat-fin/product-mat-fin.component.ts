import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-mat-fin',
  templateUrl: './product-mat-fin.component.html',
  styleUrls: ['./product-mat-fin.component.css']
})
export class ProductMatFinComponent implements OnInit {

  public detail = 'tissus';

  constructor() { }

  ngOnInit() {
  }

  setDetail(index: number) {
    switch (index) {
      case 0: {
        this.detail = 'tissu';
        break;
      }
      case 1: {
        this.detail = 'cuir';
        break;
      }
      case 2 : {
        this.detail = 'metal';
        break;
      }
      case 3 : {
        this.detail = 'bois';
        break;
      }
      case 4 : {
        this.detail = 'verre';
        break;
      }
      case 5 : {
        this.detail = 'miroir';
        break;
      }
    }
  }

}
