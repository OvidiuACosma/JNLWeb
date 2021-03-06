import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  DataExchangeService, ProductsService, TranslationService,
  ArchiveService, DownloaderService
} from '../../_services';
import { Product, Img, ProductHeroImage, ProductEF, User, IProductToFavorites } from '../../_models';
import * as _ from 'lodash';
import { UserService } from 'src/app/_services/user.service';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  prodDesc: ProductEF;
  brand = '';
  family = '';
  model = '';
  category = '';
  tabList: string[] = ['description', 'matFin', 'dimensions', 'catalogues', 'pdf'];
  product: Product;
  heroImage: Img;
  heroImages: Img[] = [];
  heroImageToPrint: Img;
  galleryThumbs: Img[] = [];
  galleryImages: Img[] = [];
  prodHeroImages: ProductHeroImage[];
  imgs: string[] = [];
  gallery: string[] = [];
  imgCount = 0;
  scroller = true;
  language: string;
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
    private archiveService: ArchiveService,
    private downloaderService: DownloaderService,
    private userService: UserService) { }

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
  }

  getProductData(product: Product) {
    this.productsService.getProduct(product)
      .subscribe(desc => {
        this.prodDesc = desc;
        this.brand = this.prodDesc.brand;
        this.category = this.prodDesc.categoryFr;
        if (this.language === 'FR') { this.family = this.prodDesc.familyFr; } else { this.family = this.prodDesc.familyEn; }
        this.model = this.prodDesc.model;
        this.getGalleryImages();
      });
  }

  getGalleryImages() {
    this.productsService.getProdGalleryImages()
      .subscribe(params => {
        this.gallery = params.filter(f => f.Brand === this.product.brand && f.Family === this.product.family
          && f.Image.substring(0, f.Image.indexOf('_')) === this.product.model).map(m => m.Image);

        for (let i = 0; i < this.gallery.length; i++) {
          this.heroImages[i] = {
            src: `assets/Images/Products/${this.product.brand}/${this.product.family}/${this.gallery[i]}`,
            alt: `${this.product.brand} ${this.family} ${this.product.model}`
          };
        }
        for (let i = 0; i < this.gallery.length; i++) {
          this.galleryThumbs[i] = {
            src: `assets/Images/Products/${this.product.brand}/${this.product.family}/Thumbs/${this.gallery[i]}`,
            alt: `${this.product.brand} ${this.family} ${this.product.model}`
          };
        }
        this.heroImage = this.heroImages[0];
        this.heroImageToPrint = this.heroImages[0];
      });
  }

  getUser() {
    this.dataex.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  switchImage(idx: number) {
    this.heroImage = this.heroImages[idx];
  }

  getStdText(lang: string) {
    this.textService.getTextProductStandard()
      .subscribe(data => {
        const resources = data[0];
        this.stdText = resources[lang.toUpperCase()];
      });
    this.getCountries();
  }

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

  priceListRequest() {
    let brand = this.brand;
    switch (brand.toLowerCase()) {
      case 'jnl collection': {
        brand = 'JNL';
        break;
      }
      case 'emanuel ungaro home': {
        brand = 'Ungaro Home';
        break;
      }
      case 'jnl studio': {
        brand = 'JNL Studio';
        break;
      }
      case 'vanhamme': {
        brand = 'Vanhamme';
        break;
      }
    }
    this.downloaderService.priceListRequest(this.language, brand);
  }

  addToFavorites(product: ProductEF) {
    const productToFavorites: IProductToFavorites = this.productsService.getProductToFavorites(product, this.language, 1);
    this.productsService.addToFavorites(productToFavorites, this.user);
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

  getProductName(): string {
    return `${this.product.family} ${this.product.model} ${this.product.brand}`;
  }

  printProductSheet() {
    window.print();
  }

  getActiveImage() {
    for (let i = 0; i < this.heroImages.length; i++) {
      const element = document.getElementById(`carouselItem${i}`);
      if (element) {
        if (element.attributes.getNamedItem('class').value.includes('item active')) {
          console.log('element:', element.children[0].children[0].attributes.getNamedItem('src').value);
        }
      } else {
        console.log('no element.');
      }
    }
  }
}
