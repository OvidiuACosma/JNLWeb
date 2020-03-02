import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataExchangeService, ProductsService, TranslationService } from '../../_services';
import { UserService } from 'src/app/_services/user.service';
import { IProductReadyToSell, IGarnissageRts, Img, ProductTDImage, IGarnissage } from 'src/app/_models';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-product-store-item',
  templateUrl: './product-store-item.component.html',
  styleUrls: ['./product-store-item.component.scss']
})
export class ProductStoreItemComponent implements OnInit {
  language: string;
  id: any;
  images: string[] = [];
  brand = '';
  family = '';
  model = '';
  price: number;
  qty: number;
  description = '';
  prodDesc: IProductReadyToSell;
  garnissageIds: string[] = [];
  prodGarns: IGarnissage[] = [];
  imgCount: number;
  heroImages: Img[] = [];
  galleryImages: Img[] = [];
  heroImageToPrint: Img;
  public TDImages: ProductTDImage[] = [];
  text: any;
  stdText: any;

  constructor(private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private dataex: DataExchangeService,
    private textService: TranslationService,
    private userService: UserService) { }

  ngOnInit() {
    this.dataex.currentLanguage
      .subscribe(lang => {
        this.language = lang || 'EN';
        this.getStdText(this.language);

        this.activatedRoute.paramMap
          .subscribe(params => {
            this.id = params.get('id');
            this.getProductData(parseInt(this.id, 10));
          });
      });
    // this.getUser();
  }

  getProductData(id: number) {
    this.productsService.getProductReadyToSell(id)
      .subscribe(desc => {
        this.prodDesc = desc;
        this.brand = desc.brand;
        this.family = this.language === 'EN' ? desc.familyEn : desc.familyFr;
        this.model = desc.model;
        this.description = this.language === 'EN' ? desc.descriptionEn : desc.descriptionFr;
        this.price = desc.price;
        this.qty = desc.qty;
        this.getProdGarnissages(id);
        this.getImages();
        this.getTDImages();
      });
  }

  getProdGarnissages(id: number) {
    this.productsService.getProdReadyToSellGarnissages(id)
      .subscribe(garn => {
        this.garnissageIds = garn.filter(f => f.productId === id).map(m => m.garnissageId);
        this.getProdGarnissageDetails(this.garnissageIds);
      });
  }

  getProdGarnissageDetails(garns: string[]) {
    this.productsService.getGarnissages()
    .subscribe(garn => {
      for (let i = 0; i < garns.length; i++) {
        const ga = garn.find(f => f.codeProd === garns[i]);
        this.prodGarns.push(ga);
      }
      // console.log('GARN: ', this.prodGarns);
    });
  }

  getImages() {
    this.productsService.getProdReadyToSellImages()
      .subscribe(params => {
        this.images = params.filter(f => f.Brand === this.brand && f.Family === this.prodDesc.familyFr
          && f.Image.substring(0, f.Image.indexOf('_')) === this.model).map(m => m.Image);
        for (let i = 0; i < this.images.length; i++) {
          this.heroImages[i] = {
            src: `assets/Images/Products/Ready To Sell/${this.brand}/${this.prodDesc.familyFr}/${this.images[i]}`,
            alt: `${this.brand} ${this.family} ${this.model}`
          };
          this.galleryImages[i] = {
            src: `assets/Images/Products/Ready To Sell/${this.brand}/${this.prodDesc.familyFr}/Thumbs/${this.images[i]}`,
            alt: `${this.brand} ${this.family} ${this.model}`
          };
        }
        this.imgCount = this.images.length;
        this.heroImageToPrint = this.heroImages[0];
      });
  }

  getTDImages() {
    this.productsService.getProdReadyToSellTDImages()
      .subscribe(params => {
        this.images = params.filter(f => f.Brand === this.brand && f.Family === this.prodDesc.familyFr
          && f.Image.substring(0, f.Image.indexOf('_')) === this.model).map(m => m.Image);
        for (let i = 0; i < this.images.length; i++) {
          this.TDImages[i] = {
            src: `assets/Images/Products/Ready To Sell/${this.brand}/${this.prodDesc.familyFr}/TD/${this.images[i]}`,
            prodCode: this.images[i].substring(this.images[i].indexOf('_') + 1, this.images[i].indexOf('.'))
          };
        }
      });
  }

  switchImageList(idx: number) {
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
    // this.getCountries();
  }

  // openDialog(garn: IProdGarnissage): Observable<boolean> {
  //   const dialogConfig = this.productService.getGarnissageDialogConfig(garn, 'ga', this.browser.isDesktopDevice);
  //   const dialogRef = this.dialog.open(ProductGarnissageDetailsComponent, dialogConfig);
  //   return dialogRef.afterClosed()
  //   .pipe(
  //     map(result => {
  //     return result;
  //   }));
  // }

  getProductName(): string {
    return `${this.family} ${this.model} ${this.brand}`;
  }

  printProductSheet() {
    window.print();
  }
}
