
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, ProductsService } from 'src/app/_services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { fillProperties } from '@angular/core/src/util/property';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit,  AfterViewChecked  {

  public product: string;

  language: string;
  text: any;
  distinctHeader: any;
  distinctContent: any;
  categoriesJSON: any[];

  selected = [0, 0, 0, 0, 0];
  scroller = true;
  numbers: number[] = [];
  total: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private dataex: DataExchangeService,
    private textService: TranslationService,
    private productService: ProductsService) {
    }

  ngOnInit() {
    this.dataex.currentLanguage
      .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });


    const numberAll = 15;
    this.total = numberAll;

    for (let index = 0; index < numberAll; index++) {
      this.numbers.push(index);
    }
  }

  // CHANGE function for FAV
  removeItem(index: number) {
    this.scroller = false;
    this.total--;

    // REMOVE FROM DB ?
  }

  getText(lang: string) {
    this.textService.getTextFavorites()
      .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });

    this.productService.getProductSearch()
    .subscribe(p => {
     this.categoriesJSON = p;
     this.distinctHeader = new Set(p.map(f => f.category));
   });
  }

  getFilters(category: string): any {
    this.distinctContent = new Set(this.categoriesJSON
      .filter(f => f.category === category)
      .map(m => m.content));
    return this.distinctContent;
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
  }


  NavigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      window.scrollTo(0, 0);
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  selectMarque(nr: number) {
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
        if (element && this.scroller === true ) {
          element.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
        this.scroller = true;
      } else if (this.scroller === true) {
          window.scrollTo(0, 0);
        }
    });
  }


  GoToProduct() {
    this.router.navigate(['product', {product: this.product}]);
  }

}
