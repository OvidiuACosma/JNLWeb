import { Component, OnInit } from '@angular/core';
import { ProductsService, PagerService } from 'src/app/_services';

@Component({
  selector: 'app-product-mat-fin',
  templateUrl: './product-mat-fin.component.html',
  styleUrls: ['./product-mat-fin.component.css']
})
export class ProductMatFinComponent implements OnInit {

  public detail = 'tissu';
  public tissus: any[];
  public cuirs: any[];
  public similiCuirs: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  // data used in the modal
  public imgSource = '';
  public garnissageModel = '';
  public garnissageCode = '';
  public garnissageDimensions = '';
  public garnissageCompositionFR = '';


  constructor(private productsService: ProductsService,
    private pagerService: PagerService) { }

  ngOnInit() {

    // get Tissus
    this.productsService.getTissus()
      .subscribe(tissus => {
        // console.log('TISSUS: ', this.tissus.length);
        this.tissus = tissus;
        // initialize to page 1
        this.setPage(1);
      });

    // get Cuirs
    this.productsService.getCuirs()
      .subscribe(cuirs => {
        this.cuirs = cuirs;
        // console.log('CUIRS: ', this.cuirs.length);
        // initialize to page 1
        this.setPage(1);
      });

    // get Simili Cuirs
    this.productsService.getSimiliCuirs()
      .subscribe(similiCuirs => {
        this.similiCuirs = similiCuirs;
        this.setPage(1);
      });
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.tissus.length, page);

    // get current page of items
    this.pagedItems = this.tissus.slice(this.pager.startIndex, this.pager.endIndex + 1);
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
        this.detail = 'similiCuir';
        break;
      }
      case 3: {
        this.detail = 'metal';
        break;
      }
      case 4: {
        this.detail = 'bois';
        break;
      }
      case 5: {
        this.detail = 'verre';
        break;
      }
      case 6: {
        this.detail = 'miroir';
        break;
      }
      default: {
        this.detail = 'tissu';
      }
    }
  }

  sendDataToModal(event) {
    const garnissageID = event.target.dataset.garnissageid;
    const material = event.target.dataset.material.toUpperCase();
    console.log('ID: ', garnissageID);
    console.log('MATERIAL: ', material);
    switch (material) {
      case 'TISSU': {
        this.garnissageModel = this.tissus[garnissageID].model;
        this.garnissageCode = this.tissus[garnissageID].codeProd.toUpperCase();
        this.garnissageDimensions = this.tissus[garnissageID].dimensions;
        this.garnissageCompositionFR = this.tissus[garnissageID].compositionFR;
        this.imgSource = 'assets\\Images\\Products\\JNL\\Garnissage\\Tissu\\' + this.garnissageCode + '_Print.jpg';
        break;
      }
      case 'CUIR': {
        this.garnissageModel = this.cuirs[garnissageID].model;
        this.garnissageCode = this.cuirs[garnissageID].codeProd.toUpperCase();
        this.garnissageDimensions = this.cuirs[garnissageID].dimensions;
        this.garnissageCompositionFR = this.cuirs[garnissageID].compositionFR;
        this.imgSource = 'assets\\Images\\Products\\JNL\\Garnissage\\Cuir\\' + this.garnissageCode + '_Print.jpg';
        break;
      }
      case 'SIMILI CUIR': {
        this.garnissageModel = this.similiCuirs[garnissageID].model;
        this.garnissageCode = this.similiCuirs[garnissageID].codeProd.toUpperCase();
        this.garnissageDimensions = this.similiCuirs[garnissageID].dimensions;
        this.garnissageCompositionFR = this.similiCuirs[garnissageID].compositionFR;
        this.imgSource = 'assets\\Images\\Products\\JNL\\Garnissage\\SimiliCuir\\' + this.garnissageCode + '_Print.jpg';
        break;
      }
    }
  }

  closeModal() {
    const modal = document.getElementById('garnissageModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        // modal.style.display = 'none';
        document.getElementById('thumbnail-img').click();
      }
    };
  }
}
