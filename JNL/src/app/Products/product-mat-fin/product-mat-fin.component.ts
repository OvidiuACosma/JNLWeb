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
  public bois: any[];
  public materials: any[];

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

    // get Materials
    this.productsService.getMaterials()
    .subscribe(materials => {
      this.materials = materials;
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
        this.metals = this.materials.filter(f => f.ctg === 2);
        console.log('Metals: ', this.metals);
        break;
      }
      case 'bois': {
        this.matCategory = 'bois';
        this.bois = this.materials.filter(f => f.ctg === 1 || f.ctg === 6);
      }
    }
  }

  sendItemToModal(mat: any) {
    this.material = mat;
  }

  navigate(direction: string) {
    this.index = this.currentMatList.indexOf(this.material);
    if (direction === 'previous') {
      if (this.index >= 1) {
        this.index--;
      } else {
        this.index = this.currentMatList.length - 1;
      }
    } else if (direction === 'next') {
      if (this.index < this.currentMatList.length - 1) {
        this.index++;
      } else {
        this.index = 0;
      }
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
