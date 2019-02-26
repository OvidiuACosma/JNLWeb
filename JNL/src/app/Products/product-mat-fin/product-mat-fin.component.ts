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
  public currentMatList: any[];
  public index: number;
  public material: any[];

  // test tab visibility
  public cuirTab: boolean;

  toggleMat = false;

  constructor(private productsService: ProductsService) { }

  ngOnInit() {

    // testing tab visibility
    this.cuirTab = true;

    // get Tissus
    this.productsService.getTissus()
      .subscribe(tissus => {
        this.tissus = tissus;
        this.currentMatList = this.tissus;
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
        this.currentMatList = this.tissus;
        break;
      }
      case 'cuir': {
        this.matCategory = 'Cuir';
        this.currentMatList = this.cuirs;
        break;
      }
      case 'simili': {
        this.matCategory = 'simili';
        this.currentMatList = this.similiCuirs;
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

  navigate(direction: string) {
    this.index = this.currentMatList.indexOf(this.material);
    if (direction === 'previous' && this.index >= 1) {
      this.index--;
    } else if (direction === 'next' && this.index < this.currentMatList.length - 1) {
      this.index++;
    }
    this.material = this.currentMatList[this.index];
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

  toggleElement() {
    this.toggleMat = !this.toggleMat;
  }
}
