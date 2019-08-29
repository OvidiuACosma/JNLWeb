import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, ProductsService, TranslationService, ArchiveService } from '../../_services';
import { Product, Img, ProductHeroImage, ProductEF, User } from '../../_models';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public detail = 'description';
  public prodDesc: ProductEF;
  public brand = '';
  public family = '';
  public model = '';
  public category = '';
  public tabList: string[] = ['description', 'matFin', 'dimensions', 'catalogues', 'pdf'];
  public product: Product;
  public heroImages: Img[] = [];
  public newHeroImages: Img[] = [];
  public galleryThumbs: Img[] = [];
  public galleryImages: Img[] = [];
  public prodHeroImages: ProductHeroImage[];
  public imgs: string[] = [];
  public gallery: string[] = [];
  public imgCount = 0;

  scroller = true;
  language: string;
  text: any;
  stdText: any;
  selected = [0, 0, 0, 0, 0];
  country: any;
  countryName: any;
  user: User;


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
    this.getUser();
    $(document).ready(function () {
      $('#carousel-custom').carousel();
    });
  }

  getProductData(product: Product) {
    this.productsService.getProduct(product)
      .subscribe(desc => {
        this.prodDesc = desc;
        this.brand = this.prodDesc.brand;
        this.category = this.prodDesc.categoryFr;
        if (this.language === 'FR') { this.family = this.prodDesc.familyFr; } else { this.family = this.prodDesc.familyEn; }
        this.model = this.prodDesc.model;
        this.getHeroImages();
        this.getGalleryImages();
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
            alt: `${this.product.brand} ${this.family} ${this.product.model}`
          };
        }
      });
  }

  getGalleryImages() {
    this.productsService.getProdGalleryImages()
      .subscribe(params => {
        this.gallery = params.filter(f => f.Brand === this.product.brand && f.Family === this.product.family
          && f.Image.substring(0, f.Image.indexOf('_')) === this.product.model).map(m => m.Image);
        for (let i = 0; i < this.gallery.length; i++) {
          this.galleryThumbs[i] = {
            src: `assets/Images/Products/${this.product.brand}/${this.product.family}/Thumbs/${this.gallery[i]}`,
            alt: `${this.product.brand} ${this.family} ${this.product.model}`
          };
        }
        for (let i = 0; i < this.gallery.length; i++) {
          this.galleryImages[i] = {
            src: `assets/Images/Products/${this.product.brand}/${this.product.family}/${this.gallery[i]}`,
            alt: `${this.product.brand} ${this.family} ${this.product.model}`
          };
        }
      });
  }

  getUser() {
    this.dataex.currentUser.subscribe( user => {
      this.user = user;
    });
  }
  switchImageList(idx: number) {
    // if (this.newHeroImages.length === 0) {
    //   this.heroImages.length = 0;
    //   this.newHeroImages = this.galleryImages.slice(idx).concat(this.galleryImages.slice(0, idx));
    //   for (let i = 0; i < this.newHeroImages.length; i++) {
    //     this.heroImages.push(this.newHeroImages[i]);
    //   }
    //   $('.carousel').carousel(0);
    //   $('.carousel').carousel('cycle');
    // } else {
      // this.heroImages.length = 0;
      // this.newHeroImages = this.galleryImages.slice();
      // for (let i = 0; i < this.newHeroImages.length; i++) {
      //   this.heroImages.push(this.newHeroImages[i]);
      // }
      // this.imgCount = this.heroImages.length;
      // $('.carousel').carousel(idx);
      // $('.carousel').carousel('cycle');
    // }

    $('.carousel').carousel('pause');
    const heroImagesTmp = _.cloneDeep(this.galleryImages);
    if (idx > 0) {
      let firstElement: Img[];
      for (let j = 0; j < idx; j++) {
        firstElement = heroImagesTmp.splice(0, 1);
        heroImagesTmp.push(firstElement[0]);
      }
    }
    this.heroImages = _.cloneDeep(heroImagesTmp);
    this.imgCount = this.heroImages.length;
    $('.carousel').carousel('cycle');
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

  addToFavorites(product: ProductEF) {
    if (this.productsService.isLoggedIn()) {
      this.productsService.openDialog(product, this.user);
    } else {
      this.productsService.openLoginDialog().subscribe(answer => {
        if (answer) {
          this.productsService.openDialog(product, this.user);
        } else {
          console.log('Not logged in. Can\'t add to favorites');
        }
      });
    }
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
