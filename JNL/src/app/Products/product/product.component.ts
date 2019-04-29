import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, ProductsService, TranslationService, ArchiveService } from '../../_services';
import { Product, Img, ProductHeroImage } from '../../_models';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public detail = 'description';
  public prodDesc: any;
  public brand = '';
  public family = '';
  public model = '';
  public category = '';
  public tabList: string[] = ['description', 'matFin', 'dimensions', 'catalogues', 'pdf'];
  public product: Product;
  public heroImages: Img[] = [];
  public prodHeroImages: ProductHeroImage[];
  public imgs: string[] = [];
  public imgCount = 0;

  scroller = true;
  language: string;
  text: any;
  stdText: any;
  selected = [0, 0, 0, 0, 0];
  country: any;
  countryName: any;


  constructor(private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router,
    private dataex: DataExchangeService,
    private textService: TranslationService,
    private archiveService: ArchiveService) { }

  ngOnInit() {
    this.dataex.currentLanguage
      .subscribe(lang => {
        this.language = lang || 'EN';
        this.getStdText(this.language);

        this.activatedRoute.paramMap
          .subscribe(params => {
            this.product = { brand: params.get('b'), family: params.get('f'), model: params.get('m') };
            this.getProductData(this.product);
          });
      });

    // activate carousel
    /* $(document).ready(function () {
      $('.carousel').carousel();
    }); */

    $(document).ready(function () {
      $('.carousel').carousel();
        $('.multi-item-carousel').carousel({
         interval: 10000
       });
       /*
       // for every slide in carousel, copy the next slide's item in the slide.
       // Do the same for the next, next item.
       $('.multi-item-carousel .item').each(function () {
         let next = $(this).next();
         if (!next.length) {
           next = $(this).siblings(':first');
         }
         next.children(':first-child').clone().appendTo($(this));

         if (next.next().length > 0) {
           next.next().children(':first-child').clone().appendTo($(this));
         } else {
           $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
         }
       }); */
    });

  }

  getProductData(product: Product) {
    this.productsService.getProduct(this.product)
      .subscribe(desc => {
        this.prodDesc = desc;
        this.brand = this.prodDesc.brand;
        this.category = this.prodDesc.categoryFr;
        if (this.language === 'FR') { this.family = this.prodDesc.familyFr; } else { this.family = this.prodDesc.familyEn; }
        this.model = this.prodDesc.model;
        this.getHeroImages();
      });
  }

  getHeroImages() {
    this.productsService.getProdHeroImages(this.product)
      .subscribe(imgDesc => {
        this.prodHeroImages = imgDesc;
        this.imgs = this.prodHeroImages.sort(function (a, b) {
          return a.imageIndex - b.imageIndex;
        }).map(img => img.imageName);
        this.imgCount = this.imgs.length;
        for (let i = 0; i < this.imgs.length; i++) {
          this.heroImages[i] = {
            src: `assets/Images/Products/${this.product.brand}/${this.product.family}/${this.imgs[i]}`,
            alt: `${this.product.brand} ${this.product.family} ${this.product.model}`
          };
        }
      });
  }

  setDetail(index: number) {
    this.detail = this.tabList[index];
  }

  getStdText(lang: string) {
    this.textService.getTextProductStandard()
      .subscribe(data => {
        const resources = data[0];
        this.stdText = resources[lang.toUpperCase()];
      });

    // standard text for the form
    this.textService.getTextFavorites()
      .subscribe(data => {
        const res = data[0];
        this.text = res[lang.toUpperCase()];
      });
    this.getCountries();
  }

  // archive country list
  countryClick() {
    this.scroller = false;
  }

  getCountries() {
    this.archiveService.getTextCountries()
      .subscribe(c => {
        const source = c[0];
        this.getCountryList(source);
      });
  }

  getCountryList(source: any) {
    this.countryName = source[this.language.toUpperCase()]['countries'];
  }

  NavigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      window.scrollTo(0, 0);
    } else {
      this.router.navigate([target], { fragment: fragment });
    }
  }

  selectOption(nr: number) {
    if (this.selected[nr] === 1) {
      this.selected[nr] = 0;
    } else {
      this.selected[nr] = 1;
    }
    this.scroller = false;
  }

}
