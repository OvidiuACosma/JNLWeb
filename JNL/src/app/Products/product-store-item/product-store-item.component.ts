import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataExchangeService, ProductsService, TranslationService } from '../../_services';
import { IProductReadyToSell, Img, ProductTDImage, IGarnissage } from 'src/app/_models';
import * as _ from 'lodash';
import { mergeMap, mergeMapTo, concatMap, map } from 'rxjs/operators';
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
  family = '';
  description = '';
  prodDesc: IProductReadyToSell;
  prodGarns: IGarnissage[] = [];
  imgCount: number;
  heroImages: Img[] = [];
  galleryImages: Img[] = [];
  heroImageToPrint: Img;
  TDImages: ProductTDImage[] = [];
  stdText: any;

  constructor(private activatedRoute: ActivatedRoute,
              private productsService: ProductsService,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataex.currentLanguage.pipe(
      mergeMap(lang => this.textService.getTextProductStandard().pipe(
        mergeMap(text => this.activatedRoute.paramMap.pipe(
          concatMap(params => this.productsService.getProductReadyToSell(Number(params.get('id'))).pipe(
            concatMap(product => this.productsService.getProdReadyToSellGarnissages(product.id).pipe(
              map(ga => ({
                lang: lang,
                text: text,
                params: params,
                product: product,
                ga: ga
              }))
            ))
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.language = resp.lang || 'EN';
      this.stdText = resp.text[0][this.language.toUpperCase()];
      this.prodDesc = resp.product;
      this.family = this.language === 'EN' ? resp.product.familyEn : resp.product.familyFr;
      this.description = this.language === 'EN' ? resp.product.descriptionEn : resp.product.descriptionFr;

      this.getProdGarnissageDetails(resp.ga.map(m => m.garnissageId));

      this.getImages();
      this.getTDImages();
    });
  }

  getProdGarnissageDetails(garns: string[]) {
    this.productsService.getGarnissages()
    .subscribe(garn => {
      for (let i = 0; i < garns.length; i++) {
        const ga = garn.find(f => f.codeProd === garns[i]);
        this.prodGarns.push(ga);
      }
    });
  }

  getImages() {
    this.productsService.getProdReadyToSellImages()
      .subscribe(params => {
        this.images = params.filter(f => f.Brand === this.prodDesc.brand && f.Family === this.prodDesc.familyFr
          && f.Image.substring(0, f.Image.indexOf('_')) === this.prodDesc.model).map(m => m.Image);
        for (let i = 0; i < this.images.length; i++) {
          const alt = `${this.prodDesc.brand} ${this.family} ${this.prodDesc.model}`;
          this.heroImages[i] = {
            src: `assets/Images/Products/Ready To Sell/${this.prodDesc.brand}/${this.prodDesc.familyFr}/${this.images[i]}`,
            alt: alt
          };
          this.galleryImages[i] = {
            src: `assets/Images/Products/Ready To Sell/${this.prodDesc.brand}/${this.prodDesc.familyFr}/Thumbs/${this.images[i]}`,
            alt: alt
          };
        }
        this.imgCount = this.images.length;
        this.heroImageToPrint = this.heroImages[0];
      });
  }

  getTDImages() {
    this.productsService.getProdReadyToSellTDImages()
      .subscribe(params => {
        this.images = params.filter(f => f.Brand === this.prodDesc.brand && f.Family === this.prodDesc.familyFr
          && f.Image.substring(0, f.Image.indexOf('_')) === this.prodDesc.model).map(m => m.Image);
        for (let i = 0; i < this.images.length; i++) {
          this.TDImages[i] = {
            src: `assets/Images/Products/Ready To Sell/${this.prodDesc.brand}/${this.prodDesc.familyFr}/TD/${this.images[i]}`,
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
    return `${this.family} ${this.prodDesc.model} ${this.prodDesc.brand}`;
  }

  printProductSheet() {
    window.print();
  }
}
