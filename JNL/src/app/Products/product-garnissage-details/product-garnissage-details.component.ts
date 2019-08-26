import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface IProductGarnissage {
  codeProd: string;
  material: string;
  model: string;
  dimensions: string;
  composition: string;
  martindale: string;
  type: string;
  brand: string;
}


@Component({
  selector: 'app-product-garnissage-details',
  templateUrl: './product-garnissage-details.component.html',
  styleUrls: ['./product-garnissage-details.component.css']
})


export class ProductGarnissageDetailsComponent implements OnInit {
  public material: any;

  constructor(public dialogRef: MatDialogRef<ProductGarnissageDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public garnData: IProductGarnissage) { }

  ngOnInit() {
  }


}
