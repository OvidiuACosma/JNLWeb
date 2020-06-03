import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExchangeService, ProductsService, TranslationService } from '../../_services';
import { IProductReadyToSell, Img, IProdGarnissage, User, Browser, IProductToFavorites, IProductShareByEmail } from 'src/app/_models';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap, concatMap, map } from 'rxjs/operators';
import { Meta } from '@angular/platform-browser';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';

@Component({
  selector: 'app-product-store-item',
  templateUrl: './product-store-item.component.html',
  styleUrls: ['./product-store-item.component.scss']
})

export class ProductStoreItemComponent implements OnInit, AfterViewChecked {
  language: string;
  id: any;
  family = '';
  description = '';
  prodDesc: IProductReadyToSell;
  prodGarns: IProdGarnissage[] = [];
  imgCount: number;
  heroImages: Img[] = [];
  galleryImages: Img[] = [];
  heroImageToPrint: Img;
  stdText: any;
  user: User;
  browser: Browser;
  carouselScrollPosition = 0;
  carouselScrollProducts: IProductReadyToSell[];


  constructor(private activatedRoute: ActivatedRoute,
              private productsService: ProductsService,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private dialog: MatDialog,
              private router: Router,
              private meta: Meta) { }

  ngOnInit() {
    this.getData();
  }

  ngAfterViewChecked() {
    this.updateMeta(`https://www.jnl.be${this.router.url}`, this.getActiveImage());
  }

  getData() {
    this.dataex.currentUser.pipe(
      mergeMap(user => this.dataex.currentBrowser.pipe(
        mergeMap(_browser => this.dataex.currentLanguage.pipe(
          mergeMap(lang => this.textService.getTextProductStandard().pipe(
            mergeMap(text => this.activatedRoute.paramMap.pipe(
              concatMap(params => this.productsService.getProductReadyToSell(Number(params.get('id')), user.type || 'w').pipe(
                mergeMap(product => this.productsService.getProductsReadyToSell(user.type || 'w').pipe(
                  map(products => ({
                    user: user,
                    browser: _browser,
                    lang: lang,
                    text: text,
                    params: params,
                    product: product,
                    products: products
                    // ga: ga
                  }))
                ))
              ))
            ))
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.browser = resp.browser;
      this.language = resp.lang || 'EN';
      this.stdText = resp.text[0][this.language.toUpperCase()];
      this.prodDesc = resp.product;
      this.family = this.language === 'EN' ? resp.product.familyEn : resp.product.familyFr;
      this.description = this.language === 'EN' ? resp.product.descriptionEn : resp.product.descriptionFr;
      this.user = resp.user;
      this.carouselScrollProducts = this.getCarouselScrollProductsOrdered(resp.products, resp.product);
      this.getImages();
    });
  }

  getCarouselScrollProductsOrdered(products: IProductReadyToSell[], currentProduct: IProductReadyToSell): IProductReadyToSell[] {
    products = _.orderBy(products, ['familyFr'], ['asc']);
    const productsOfTheSameFamily = _.filter(products, { 'familyFr': currentProduct.familyFr });
    const otherProducts = _.difference(products, productsOfTheSameFamily);
    return _.concat(productsOfTheSameFamily, otherProducts);
  }

  getImages() {
    this.productsService.getProdReadyToSellImages()
      .subscribe(params => {
        const images = params.filter(f => f.Brand === this.prodDesc.brand && f.Family === this.prodDesc.familyFr
          && f.Image.substring(0, f.Image.indexOf('_')) === this.prodDesc.id.toString()).map(m => m.Image);
        for (let i = 0; i < images.length; i++) {
          this.heroImages[i] = {
            src: `assets/Images/Products/Ready To Sell/${this.prodDesc.brand}/${this.prodDesc.familyFr}/${images[i]}`,
            alt: `${this.prodDesc.brand} ${this.family} ${this.prodDesc.model}`
          };
        }
        this.imgCount = this.heroImages.length;
        this.heroImageToPrint = this.heroImages[0];
      });
  }

  getProductName(): string {
    return `${this.family} ${this.prodDesc.model} ${this.prodDesc.brand}`;
  }

  orderHere() {
    const element = document.getElementById('requestForm');
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  addToFavorites(product: IProductReadyToSell) {
    const productToFavorites: IProductToFavorites = this.productsService.getProductToFavorites(product, this.language, 4);
    if (!this.user) {
      this.dataex.currentUser.subscribe(user => {
        console.log('user not ex. user:', user);
        this.productsService.addToFavorites(productToFavorites, user);
      });
    } else {
      this.productsService.addToFavorites(productToFavorites, this.user);
    }
  }

  shareOnFacebook() {
    // http://www.facebook.com/sharer.php?u=[EncodedURL]
      const pageUrl = `https://www.jnl.be${this.router.url}`;
      const linkUrl = `http://www.facebook.com/sharer.php?u=${pageUrl}&src=sdkpreparse`;
      this.followLink(linkUrl);
  }

  shareOnPinterest() {
    // http://pinterest.com/pin/create/button/?url=[EncodedURL]&media=[MEDIA]
    const pageUrl = `https://www.jnl.be${this.router.url}`;
    const mediaUrl = this.getActiveImage();
    const linkUrl = `http://pinterest.com/pin/create/button/?url=${pageUrl}&media=${mediaUrl}`;
    this.followLink(linkUrl);
  }

  followLink(linkUrl: string) {
    const a = document.createElement('a');
      a.href = linkUrl;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.setAttribute('visibility', 'hidden');
      a.click();
  }

  shareByEmail() {
    const productShareByEmail: IProductShareByEmail = {
      product: `${this.prodDesc.familyEn} ${this.prodDesc.model} - ${this.prodDesc.brand}`,
      productUrl: `https://www.jnl.be${this.router.url}`,
      imageUrl: this.getActiveImage(),
      senderName: '',
      senderEmail: '',
      recipientEmails: [],
      message: ''
    };
    this.openDialog(productShareByEmail);
  }

  openDialog(productShareByEmail: IProductShareByEmail): void {
    const dialogRef = this.dialog.open(EmailSharingComponent, {
      width: '543px',
      data: {
        product: productShareByEmail
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      return;
    });
  }

  printProductSheet() {
    window.print();
  }

  trackByFn(index: number, item: any) {
    // console.log('slide:', index);
  }

  carouselSlideChange(i: number) {
    // console.log('carousel changed:', i);
  }

  getActiveImage(): string {
    let imageLink: string;
    for (let i = 0; i < this.heroImages.length; i++) {
      const element = document.getElementById(`carouselItem${i}`);
      if (element) {
        if (element.attributes.getNamedItem('class').value.includes('item active')) {
            imageLink = element.children[0].children[0].attributes.getNamedItem('src').value.replace(/ /g, '%20');
          }
      } else {
        imageLink = '';
      }
    }
    return `https://www.jnl.be/${imageLink}`;
  }

  updateMeta(linkUrl: string, imageUrl: string) {
    // TODO: get the tags and save to replace on destroy
    this.meta.updateTag({name: 'og:description', content: 'JNL Luxury Furniture'});
    this.meta.updateTag({name: 'og:url', content: linkUrl});
    this.meta.updateTag({name: 'og:type', content: 'website'});
    this.meta.updateTag({name: 'og:title', content: 'JNL Luxury Furniture'});
    this.meta.updateTag({name: 'og:image', content: imageUrl});
  }

  getLeftPosition(): number {
    return this.carouselScrollPosition;
  }

  moveElements(sign: number) {
    const ecart = 20;
    this.carouselScrollPosition += sign * ecart;
  }

  getCarouselProductImage(product: IProductReadyToSell): string {
    const src = `assets/Images/Products/Ready To Sell/${product.brand}/${product.familyFr}/Search/${product.id}.jpg`;
    return src;
  }

  getCarouselProductAlt(product: IProductReadyToSell): string {
    let alt = this.language.toLowerCase() === 'fr' ? product.familyFr : product.familyEn;
    alt = alt + ' ' + product.model + ' - ' + product.brand;
    return alt;
  }
}
