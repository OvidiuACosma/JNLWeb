import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataExchangeService, ProductsService, TranslationService } from '../../_services';
import { UserService } from 'src/app/_services/user.service';
import { IProductReadyToSell, Img, ProductTDImage } from 'src/app/_models';

interface IProdDesc {
  id: number;
  brand: string;
  family: string;
  model: string;
  description: string;
  price: number;
  qty: number;
}

@Component({
  selector: 'app-product-store-item',
  templateUrl: './product-store-item.component.html',
  styleUrls: ['./product-store-item.component.scss']
})
export class ProductStoreItemComponent implements OnInit {
  language: string;
  product: IProdDesc;
  id: any;
  images: string[] = [];
  brand = '';
  family = '';
  model = '';
  price: number;
  qty: number;
  description = '';
  prodDesc: IProductReadyToSell;
  imgCount: number;
  heroImages: Img[] = [];
  galleryImages: Img[] = [];
  public TDImages: ProductTDImage[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private productsService: ProductsService,
              // private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              // private archiveService: ArchiveService,
              // private downloaderService: DownloaderService,
              private userService: UserService) { }

  ngOnInit() {
    this.dataex.currentLanguage
      .subscribe(lang => {
        this.language = lang || 'EN';
        // this.getStdText(this.language);

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
        this.getImages();
        this.getTDImages();
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

  getProductName(): string {
    return `${this.family} ${this.model} ${this.brand}`;
  }

  printProductSheet() {
    window.print();
  }
}
