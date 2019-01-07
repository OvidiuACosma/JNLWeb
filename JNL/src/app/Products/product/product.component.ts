import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public detail = 'description';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  setDetail(index: number) {
    switch (index) {
      case 0: {
        this.detail = 'description';
        break;
      }
      case 1: {
        this.detail = 'matFin';
        break;
      }
      case 2 : {
        this.detail = 'dimensions';
        break;
      }
      case 3 : {
        this.detail = 'catalogues';
        break;
      }
      case 4 : {
        this.detail = 'pdf';
        break;
      }
    }
  }

}
