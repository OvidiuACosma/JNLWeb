import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public detail = 'description';
  public tabList: string[] = ['description', 'matFin', 'dimensions', 'catalogues', 'pdf'];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  setDetail(index: number) {
    this.detail = this.tabList[index];
  }

}
