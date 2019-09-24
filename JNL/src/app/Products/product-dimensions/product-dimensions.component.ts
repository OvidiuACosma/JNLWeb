import { Component, OnInit, Input } from '@angular/core';
import { DataExchangeService, ProductsService } from '../../_services';
import { Product, ProductTDImage } from '../../_models';

import * as _ from 'lodash';

@Component({
  selector: 'app-product-dimensions',
  templateUrl: './product-dimensions.component.html'
})
export class ProductDimensionsComponent implements OnInit {

  @Input() product: Product;
  public family: string;
  public images: string[] = [];
  public TDImages: ProductTDImage[] = [];
  public currentTDImage: ProductTDImage;
  public index: number;

  language: string;
  prodDesc: any;
  toggle = false;

  constructor(private productsService: ProductsService, private dataex: DataExchangeService) { }

  ngOnInit() {
    this.dataex.currentLanguage
      .subscribe(lang => {
        this.language = lang || 'EN';
        this.getProductFamily();
      });

    this.getImages();
  }

  getProductFamily() {
    this.productsService.getProduct(this.product)
      .subscribe(desc => {
        this.prodDesc = desc;
        if (this.language === 'FR') { this.family = this.prodDesc.familyFr; } else { this.family = this.prodDesc.familyEn; }
      });
  }

  getImages() {
    this.productsService.getProdTechDetImages()
      .subscribe(params => {
        this.images = params.filter(f => f.Brand === this.product.brand && f.Family === this.product.family
          && f.Image.substring(0, f.Image.indexOf('_')) === this.product.model).map(m => m.Image);
        for (let i = 0; i < this.images.length; i++) {
          this.TDImages[i] = {
            src: `assets/Images/Products/${this.product.brand}/${this.product.family}/TD/${this.images[i]}`,
            prodCode: this.images[i].substring(this.images[i].indexOf('_') + 1, this.images[i].indexOf('.'))
          };
        }
      });
  }

  sendToModal(item: ProductTDImage) {
    this.currentTDImage = item;
  }

  navigate(direction: string) {
    this.index = this.TDImages.findIndex(idx => idx.prodCode === this.currentTDImage.prodCode);
    if (direction === 'previous') {
      this.index--;
      if (this.index === -1) {
        this.index = this.TDImages.length - 1;
      }
    } else if (direction === 'next') {
      this.index = (this.index + 1) % this.TDImages.length;
    }
    this.currentTDImage = this.TDImages[this.index];
  }

  closeModal() {
    const modal = document.getElementById('TDModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        document.getElementById('btClose').click();
      }
    };
  }

  toggleElement() {
    this.toggle = !this.toggle;
  }

}
