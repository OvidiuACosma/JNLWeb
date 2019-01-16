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

  constructor(private productsService: ProductsService) { }

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
    }
    this.productsService.getTissus()
    .subscribe(tissus => {
        this.tissus = tissus;
        console.log('TISSUS: ', tissus);
    });
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
