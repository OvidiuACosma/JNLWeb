import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from '../../_services';
import { Product } from '../../_models';
declare var $: any;

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.css']
})
export class ProductGalleryComponent implements OnInit {
  @Input() product: Product;
  brand: string;
  family: string;
  model: string;
  public gallery: string[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.brand = this.product.brand;
    this.family = this.product.family;
    this.model = this.product.model;

    // this.productsService.getGalleryImages()
    //   .subscribe(params => {
    //     this.gallery = params.filter(f => f.Brand === this.brand && f.Family === this.family && f.Image.includes(this.model))
    //       .map(m => m.Image);
    //   });

    // $(document).ready(function () {
    //     $('#carouselGallery').carousel('pause');
    // });

    $('#carouselGallery').on('slide.bs.carousel', function (event: any) {
      const target = $(event.relatedTarget);
      console.log('TARGET: ', event.relatedTarget);
      const idx = target.index();
      const itemsPerSlide = 4;
      const totalItems = $('.gallery-carousel-inner').children('.carousel-item').length;
      // console.log('TEST: ', idx + ' ' + totalItems);

      if (idx >= totalItems - (itemsPerSlide - 1)) {
        const it = itemsPerSlide - (totalItems - idx);
        for (let i = 0; i < it; i++) {
          // append slides to end
          if (event.direction === 'left') {
            $('.carousel-item').eq(i).appendTo('.gallery-carousel-inner');
          } else {
            $('.carousel-item').eq(0).appendTo('.gallery-carousel-inner');
          }
        }
      }
    });

    $('#carouselGallery').carousel({
      interval: 4000
    });
  }

}
