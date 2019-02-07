import { Component, OnInit } from '@angular/core';
import { ProductsService, PagerService } from 'src/app/_services';

@Component({
  selector: 'app-product-mat-fin',
  templateUrl: './product-mat-fin.component.html',
  styleUrls: ['./product-mat-fin.component.css']
})
export class ProductMatFinComponent implements OnInit {

  public matCategory = 'tissu';
  public tissus: any[];
  public cuirs: any[];
  public similiCuirs: any[];

  // pager object
  pager: any = {};

  // paged items
  tissuPagedItems: any[];
  cuirPagedItems: any[];
  similiPagedItems: any[];

  // page size (number of thumbnails) for pager
  pageSize: number;

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
        this.tissus = tissus;
        // initialize to page 1
        this.setPage(1);
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

    this.setPageSize();
  }

  setCategory(category: string) {
    switch (category) {
      case 'tissu': {
        this.matCategory = 'tissu';
        this.setPage(1);
        break;
      }
      case 'cuir': {
        this.matCategory = 'cuir';
        this.setPage(1);
        break;
      }
      case 'similicuir': {
        this.matCategory = 'similicuir';
        this.setPage(1);
        break;
      }
    }
  }

  // set number of thumbnails per page
  setPageSize() {
    const cssWidth: number = window.innerWidth;
    // xl
    if (cssWidth >= 1200) {
      this.pageSize = 24;
      // lg
    } else if (cssWidth < 1200 && cssWidth >= 992) {
      this.pageSize = 16;
      // md
    } else if (cssWidth < 992 && cssWidth >= 768) {
      this.pageSize = 12;
      // sm
    } else if (cssWidth < 768) {
      this.pageSize = 8;
    }
  }

  setPage(page: number) {
    if (this.matCategory === 'tissu') {
      // get pager object from service
      this.pager = this.pagerService.getPager(this.tissus.length, page, this.pageSize);

      // get current page of items
      this.tissuPagedItems = this.tissus.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else if (this.matCategory === 'cuir') {
      this.pager = this.pagerService.getPager(this.cuirs.length, page, this.pageSize);
      this.cuirPagedItems = this.cuirs.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else if (this.matCategory === 'similicuir') {
      this.pager = this.pagerService.getPager(this.similiCuirs.length, page, this.pageSize);
      this.similiPagedItems = this.similiCuirs.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }

  onResize() {
    this.setPageSize();
    this.setPage(1);
  }

  sendDataToModal(event) {
    const garnissageID = event.target.dataset.garnissageid;
    const material = event.target.dataset.material.toUpperCase();

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

  getPrevious() {
    console.log('PREVIOUS');
  }

  getNext() {
    console.log('NEXT');
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
