import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, ProductsService, TranslationService, ArchiveService } from 'src/app/_services';
import { Product, Img } from 'src/app/_models';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewChecked {

  public detail = 'description';
  public product_id: string;
  public prodDesc: any;
  public brand = 'JNL Collection';
  public family = '';
  public prodName = '';
  public tabList: string[] = ['description', 'matFin', 'dimensions', 'catalogues', 'pdf'];
  product: Product;
  public heroImages: Img[] = [];

  scroller = true;
  language: string;
  text: any;
  selected = [0, 0, 0, 0, 0];
  country: any;
  countryName: any;


  constructor(private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private dataex: DataExchangeService,
    private textService: TranslationService,
    private countryList: ArchiveService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.product = new Product();
      this.product.brand = params.b;
      this.product.family = params.f;
      this.product.model = params.m;
      this.getProductData(this.product);
    });

    this.dataex.currentLanguage
      .subscribe(lang => {
        this.language = lang || 'EN';
        this.getText(lang);
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
        this.family = this.prodDesc.familyFr;
        this.prodName = this.prodDesc.model;
        this.getHeroImages();
      });
  }

  getHeroImages() {
    // TODO: get from API
    for (let i = 0; i <= 3 ; i++) {
      this.heroImages[i] = { src: `assets/Images/Products/${this.product.brand}/${this.product.family}/${this.product.model}_${i}.jpg`,
                           alt: `${this.product.brand} ${this.product.family} ${this.product.model}`};
    }
  }

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
    this.countryList.getTextCountries()
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

  ngAfterViewChecked() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element && this.scroller === true) {
          element.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
        this.scroller = true;
      } else if (this.scroller === true) {
        // window.scrollTo(0, 0);
      }
    });
  }

}
