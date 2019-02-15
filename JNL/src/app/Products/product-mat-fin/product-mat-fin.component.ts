import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/_services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { materialize } from 'rxjs/operators';

@Component({
  selector: 'app-product-mat-fin',
  templateUrl: './product-mat-fin.component.html',
  styleUrls: ['./product-mat-fin.component.css']
})
export class ProductMatFinComponent implements OnInit {

  public matCategory = 'Tissu';
  public tissus: any[];
  public cuirs: any[];
  public similiCuirs: any[];
  public abatjours: any[];
  public metals: any[];

  // data used in modal
  public index: number;
  public currentMatList: any[];
  public material: any[];

  // test tab visibility
  public cuirTab: boolean;

  constructor(private productsService: ProductsService) { }

  ngOnInit() {

    // testing tab visibility
    this.cuirTab = true;

    // get Tissus
    this.productsService.getTissus()
      .subscribe(tissus => {
        this.tissus = tissus;
      });

    // get Cuirs
    this.productsService.getCuirs()
      .subscribe(cuirs => {
        this.cuirs = cuirs;
      });

    // get Simili Cuirs
    this.productsService.getSimiliCuirs()
      .subscribe(similiCuirs => {
        this.similiCuirs = similiCuirs;
      });
  }

  setCategory(category: string) {
    switch (category) {
      case 'tissu': {
        this.matCategory = 'Tissu';
        break;
      }
      case 'cuir': {
        this.matCategory = 'Cuir';
        break;
      }
      case 'simili': {
        this.matCategory = 'simili';
        break;
      }
      case 'abatjour': {
        this.matCategory = 'abatjour';
        break;
      }
      case 'metal': {
        this.matCategory = 'metal';
        break;
      }
    }
  }

  sendItemToModal(mat: any) {
    this.material = mat;
  }


  getPrevious() {
    if (this.matCategory === 'Tissu') {
      this.index = this.tissus.indexOf(this.material);
      if (this.index >= 1) {
        this.index--;
        this.material = this.tissus[this.index];
      }
    }
    if (this.matCategory === 'Cuir') {
      this.index = this.cuirs.indexOf(this.material);
      if (this.index >= 1) {
        this.index--;
        this.material = this.cuirs[this.index];
      }
    }
    if (this.matCategory === 'simili') {
      this.index = this.similiCuirs.indexOf(this.material);
      if (this.index >= 1) {
        this.index--;
        this.material = this.similiCuirs[this.index];
      }
    }
  }

  getNext() {
    if (this.matCategory === 'Tissu') {
      this.index = this.tissus.indexOf(this.material);
      if (this.index < this.tissus.length - 1) {
        this.index++;
        this.material = this.tissus[this.index];
      }
    }

    if (this.matCategory === 'Cuir') {
      this.index = this.cuirs.indexOf(this.material);
      if (this.index < this.cuirs.length - 1) {
        this.index++;
        this.material = this.cuirs[this.index];
      }
    }

    if (this.matCategory === 'simili') {
      this.index = this.similiCuirs.indexOf(this.material);
      if (this.index < this.similiCuirs.length - 1) {
        this.index++;
        this.material = this.similiCuirs[this.index];
      }
    }

  }

  closeModal() {
    const modal = document.getElementById('garnissageModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        document.getElementById('thumbnail-img').click();
      }
    };
  }
}
