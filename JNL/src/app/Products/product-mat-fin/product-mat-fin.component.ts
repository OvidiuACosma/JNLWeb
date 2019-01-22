import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/_services';

@Component({
  selector: 'app-product-mat-fin',
  templateUrl: './product-mat-fin.component.html',
  styleUrls: ['./product-mat-fin.component.css']
})
export class ProductMatFinComponent implements OnInit {

  public detail = 'tissu';
  public tissus: any[];

  // data used in the modal
  public source = '';
  public tissuModel = '';
  public tissuCodeProd = '';
  public tissuDimensions = '';
  public tissuCompositionFR = '';


  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.detail = 'tissu';
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
      case 2: {
        this.detail = 'metal';
        break;
      }
      case 3: {
        this.detail = 'bois';
        break;
      }
      case 4: {
        this.detail = 'verre';
        break;
      }
      case 5: {
        this.detail = 'miroir';
        break;
      }
      default: {
        this.detail = 'tissu';
      }
    }

    this.productsService.getTissus()
    .subscribe(tissus => {
        this.tissus = tissus;
        // console.log('TISSUS: ', tissus[0].model);
    });
  }

  setTissuID(event) {
    const tissuID = event.target.dataset.tissuid;
    this.tissuModel = this.tissus[tissuID].model;
    this.tissuCodeProd = this.tissus[tissuID].codeProd.toUpperCase();
    this.tissuDimensions = this.tissus[tissuID].dimensions;
    this.tissuCompositionFR = this.tissus[tissuID].compositionFR;
    this.source = 'assets\\Images\\Products\\JNL\\Garnissage\\Tissu\\' + this.tissuCodeProd + '_Print.jpg';
    // console.log(event.target.dataset.tissuid);
 }

  closeModal() {
    const modal = document.getElementById('garnissageModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }

}
