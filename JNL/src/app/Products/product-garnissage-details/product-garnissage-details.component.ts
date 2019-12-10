import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProdGarnissage } from 'src/app/_models';


@Component({
  selector: 'app-product-garnissage-details',
  templateUrl: './product-garnissage-details.component.html',
  styleUrls: ['./product-garnissage-details.component.scss']
})


export class ProductGarnissageDetailsComponent implements OnInit {
  public material: any;

  constructor(public dialogRef: MatDialogRef<ProductGarnissageDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public garnData: IProdGarnissage) { }

  ngOnInit() {
  }

  navigate(direction: string) {}

  addToFavorites(garnData: IProdGarnissage) {
    // TODO: close the modal, then follow the add to favList procedure by garnData.id
  }
}
