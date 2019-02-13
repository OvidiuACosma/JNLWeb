import { Component, OnInit } from '@angular/core';
import { ProductsService, PagerService } from 'src/app/_services';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
  public abatjours: any[];
  public metals: any[];
  public garnissageID: string;
  public material: string;

  // test tab visibility
  public cuirTab: boolean;

  // data used in the modal
  public imgSource = '';
  public garnissageModel = '';
  public garnissageCode = '';
  public garnissageDimensions = '';
  public garnissageCompositionFR = '';
  public garnissageMartindale = '';


  constructor(private productsService: ProductsService,
    private pagerService: PagerService) { }

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
        this.matCategory = 'tissu';
        break;
      }
      case 'cuir': {
        this.matCategory = 'cuir';
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

  sendDataToModal(event) {
    this.garnissageID = event.target.dataset.garnissageid;
    this.material = event.target.dataset.material.toUpperCase();

    // hidden
    document.getElementById('garnId').innerText = this.garnissageID;

    switch (this.material) {
      case 'TISSU': {
        this.garnissageModel = this.tissus[this.garnissageID].model;
        this.garnissageCode = this.tissus[this.garnissageID].codeProd.toUpperCase();
        this.garnissageDimensions = this.tissus[this.garnissageID].dimensions;
        this.garnissageCompositionFR = this.tissus[this.garnissageID].compositionFR;
        this.garnissageMartindale = this.tissus[this.garnissageID].martindale;
        this.imgSource = '/assets/Images/Products/JNL/Garnissage/tissu/' + this.garnissageCode + '_Print.jpg';
        break;
      }
      case 'CUIR': {
        this.garnissageModel = this.cuirs[this.garnissageID].model;
        this.garnissageCode = this.cuirs[this.garnissageID].codeProd.toUpperCase();
        this.garnissageDimensions = this.cuirs[this.garnissageID].dimensions;
        this.garnissageCompositionFR = this.cuirs[this.garnissageID].compositionFR;
        this.garnissageMartindale = this.cuirs[this.garnissageID].martindale;
        this.imgSource = '/assets/Images/Products/JNL/Garnissage/cuir/' + this.garnissageCode + '_Print.jpg';
        break;
      }
      case 'SIMILI CUIR': {
        this.garnissageModel = this.similiCuirs[this.garnissageID].model;
        this.garnissageCode = this.similiCuirs[this.garnissageID].codeProd.toUpperCase();
        this.garnissageDimensions = this.similiCuirs[this.garnissageID].dimensions;
        this.garnissageCompositionFR = this.similiCuirs[this.garnissageID].compositionFR;
        this.garnissageMartindale = this.similiCuirs[this.garnissageID].martindale;
        this.imgSource = '/assets/Images/Products/JNL/Garnissage/simili/' + this.garnissageCode + '_Print.jpg';
        break;
      }
    }
  }

  getPrevious() {
    let list: any[];
    if (this.matCategory === 'tissu') {
      list = this.tissus;
    } else if (this.matCategory === 'cuir') {
      list = this.cuirs;
    } else if (this.matCategory === 'simili') {
      list = this.similiCuirs;
    }

    // index from the hidden input box
    let id: any = document.getElementById('garnId').innerText;
    id--;
    if (id >= 0) {
      document.getElementById('garnId').innerText = id;
      this.garnissageModel = list[id].model;
      this.garnissageCode = list[id].codeProd.toUpperCase();
      this.garnissageDimensions = list[id].dimensions;
      this.garnissageCompositionFR = list[id].compositionFR;
      this.garnissageMartindale = list[id].martindale;
      this.imgSource = '/assets/Images/Products/JNL/Garnissage/' + this.matCategory + '/' + this.garnissageCode + '_Print.jpg';
    }
  }

  getNext() {
    let list: any[];
    if (this.matCategory === 'tissu') {
      list = this.tissus;
    } else if (this.matCategory === 'cuir') {
      list = this.cuirs;
    } else if (this.matCategory === 'simili') {
      list = this.similiCuirs;
    }


    // index from the hidden input box
    let id: any = document.getElementById('garnId').innerText;
    id++;
    if (id < list.length) {
      document.getElementById('garnId').innerText = id;
      this.garnissageModel = list[id].model;
      this.garnissageCode = list[id].codeProd.toUpperCase();
      this.garnissageDimensions = list[id].dimensions;
      this.garnissageCompositionFR = list[id].compositionFR;
      this.garnissageMartindale = list[id].martindale;
      this.imgSource = '/assets/Images/Products/JNL/Garnissage/' + this.matCategory + '/' + this.garnissageCode + '_Print.jpg';
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
