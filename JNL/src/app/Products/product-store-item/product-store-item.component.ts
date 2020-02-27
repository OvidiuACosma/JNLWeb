import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataExchangeService, ProductsService, TranslationService } from '../../_services';
import { IProductReadyToSell } from '../../_models';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-product-store-item',
  templateUrl: './product-store-item.component.html',
  styleUrls: ['./product-store-item.component.scss']
})
export class ProductStoreItemComponent implements OnInit {
  language: string;
  product: IProductReadyToSell;
  id: any;
  brand = '';
  family = '';
  model = '';
  price: number;
  qty: number;

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
        this.brand = desc.brand;
        if (this.language === 'FR') { this.family = desc.familyFr; } else { this.family = desc.familyEn; }
        this.model = desc.model;
        this.price = desc.price;
        this.qty = desc.qty;
        // this.getHeroImages();
        // this.getGalleryImages();
      });
  }

}
