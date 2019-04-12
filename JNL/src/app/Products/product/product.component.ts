import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataExchangeService, ProductsService, TranslationService, ArchiveService } from '../../_services';
import { Product, Img, ProductHeroImage} from '../../_models';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit/*, AfterViewChecked*/ {

  public detail = 'description';
  // public product_id: string;
  public prodDesc: any;
  public brand = '';
  public family = '';
  public model = '';
  public tabList: string[] = ['description', 'matFin', 'dimensions', 'catalogues', 'pdf'];
  public product: Product;
  public heroImages: Img[] = [];
  public prodHeroImages: ProductHeroImage[];
  public imgs: string[] = [];

  scroller = true;
  language: string;
  text: any;
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
        this.getText(lang);

        this.activatedRoute.paramMap
          .subscribe(params => {
            this.product = { brand: params.get('b'), family: params.get('f'), model: params.get('m') };
            this.getProductData(this.product);
          });
      });

    // activate carousel
    $(document).ready(function () {
      $('.carousel').carousel();
    });
  }

  getProductData(product: Product) {
    this.productsService.getProduct(this.product)
      .subscribe(desc => {
        this.prodDesc = desc;
        this.brand = this.prodDesc.brand;
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
        for (let i = 0; i < this.imgs.length; i++) {
          this.heroImages[i] = {
            src: `assets/Images/Products/${this.product.brand}/${this.product.family}/${this.imgs[i]}`,
            alt: `${this.product.brand} ${this.product.family} ${this.product.model}`
          };
        }
      });
  }

  // ngAfterViewChecked() {
  //   this.route.fragment.subscribe(fragment => {
  //     if (fragment) {
  //       const element = document.getElementById(fragment);
  //       if (element && this.scroller === true) {
  //         element.scrollIntoView({ block: 'start', behavior: 'smooth' });
  //       }
  //       this.scroller = true;
  //     } else if (this.scroller === true) {
  //       // window.scrollTo(0, 0);
  //     }
  //   });
  // }

  setDetail(index: number) {
    this.detail = this.tabList[index];
  }

  getText(lang: string) {
    this.textService.getTextFavorites()
      .subscribe(data => {
        const res = data[0];
        this.getLanguageText(res);
      });
    this.getCountries();
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
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
