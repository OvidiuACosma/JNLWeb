import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from 'src/app/_services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { materialize } from 'rxjs/operators';
import * as _ from 'lodash';
import { Product } from 'src/app/_models';

@Component({
  selector: 'app-product-mat-fin',
  templateUrl: './product-mat-fin.component.html',
  styleUrls: ['./product-mat-fin.component.css']
})
export class ProductMatFinComponent implements OnInit {

  @Input() product: Product;
  public prodDesc: any[];
  public matCat: number[];
  public matCategory = 'Tissu';
  public tissus: any[];
  public cuirs: any[];
  public similiCuirs: any[];
  public abatjours: any[];
  public metals: any[];
  public bois: any[];
  public pierre: any[];
  public verre: any[];
  public miroir: any[];
  public placages: any[];
  public materials: any[];

  // data used in modal
  public currentMatList: any[];
  public index: number;
  public material: any[];

  toggleMat = false;

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getProductDesc(this.product)
      .subscribe(desc => {
        this.prodDesc = desc;
        this.getMatCategories();
      });
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

    /*
    // get Materials
    this.productsService.getMaterials()
      .subscribe(materials => {
        this.materials = materials;
      });
      */
  }

  getMatCategories() {
    const matList: any[] = [];
    this.prodDesc.forEach(item => {
      if (item.materialCategory) {
        matList.push(Number(item.materialCategory));
      }
    });
    this.matCat = _.uniq(matList.sort(function (a, b) {
      return a - b;
    }));
    console.log('CTGS: ', this.matCat);
    this.getMatFinByCtg();
  }

  getMatFinByCtg() {
    this.matCat.forEach(item => {
      switch (item) {
        case 1: {
          this.bois = this.getMatFinList(1);
          break;
        }
        case 2: {
          this.metals = this.getMatFinList(2);
          break;
        }
        case 3: {
          this.pierre = this.getMatFinList(3);
          break;
        }
        case 5: {
          this.abatjours = this.getMatFinList(5);
          break;
        }
        case 7: {
          this.verre = this.getMatFinList(7);
          break;
        }
        case 11: {
          this.placages = this.getMatFinList(11);
        }
      }
    });
  }

  getMatFinList(ctg: number) {
    let desc: any[];
    const matFin: any[] = [];
    desc = this.prodDesc.filter(f => f.materialCategory === ctg);
    desc.forEach(i => {
      if (i.materialNameFr && i.finisageNameFr) {
        matFin.push(i.materialNameFr + ' ' + i.finisageNameFr);
      }
    });
    if (matFin.length > 0) {
      return matFin;
    }
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
      case 'bois': {
        this.matCategory = 'bois';
        break;
      }
      case 'pierre': {
        this.matCategory = 'pierre';
        this.pierre = this.materials.filter(f => f.ctg === 3);
      }
    }
  }

  sendItemToModal(mat: any) {
    this.material = mat;
  }

  navigate(direction: string) {
    this.index = this.currentMatList.indexOf(this.material);
    if (direction === 'previous') {
      // this.index = (this.index - 1) % this.currentMatList.length;
      this.index--;
      if (this.index === -1) {
        this.index = this.currentMatList.length - 1;
      }
    } else if (direction === 'next') {
      this.index = (this.index + 1) % this.currentMatList.length;
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
