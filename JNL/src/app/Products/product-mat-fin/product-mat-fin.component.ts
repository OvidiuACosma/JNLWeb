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
  public source = '';
  public tissuModel = '';
  public tissuCodeProd = '';
  public tissuDimensions = '';
  public tissuCompositionFR = '';


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
    this.productsService.getCuirs()
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
        // modal.style.display = 'none';
        document.getElementById('thumbnail-img').click();
      }
    };
  }
}
