import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExchangeService, TranslationService, AltImgService, DownloaderService } from '../../_services';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-marque',
  templateUrl: './marque.component.html',
  styleUrls: ['./marque.component.css']
})
export class MarqueComponent implements OnInit {

  language: string;
  text: any;
  textG: any;
  collectionsText = ['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'LUZ Interiors'];
  collectionsLink = ['jnl', 'vanhamme', 'ungaro', 'luz'];
  othersText: string[];
  othersLink: string[];
  i: number;
  collections: number;
  public marque: string;
  blob: any;
  url: any;

  altText: any;
  page = 'marque';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private altService: AltImgService,
              private downloader: DownloaderService) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.marque = p['marque'];
      this.i = this.collectionsLink.indexOf(this.marque);
      this.othersLink = _.clone(this.collectionsLink);
      this.othersText = _.clone(this.collectionsText);
      this.othersLink.splice(this.i, 1);
      this.othersText.splice(this.i, 1);
      this.collections = this.othersLink.length;
      this.i = this.i % this.collections;
    });

    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
      this.getAlt(this.page);
    });
  }

  getText(lang: string) {
    this.textService.getTextMarque()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res['Collections'][this.language.toUpperCase()][this.marque.toUpperCase()];
    this.textG = res['Generic'][this.language.toUpperCase()];
  }

  getAlt(page: string) {
    this.altService.getAltImages()
    .subscribe(data => {
      const res = data[0];
      this.altText = this.getAltText(res, this.page);
    });
  }

  getAltText(res: any, page: string): any {
    return res[page];
  }

  getIndicatorsText(): string[] {
    const indicators: string[] = [];
    for (const ind of this.text.productCategories) {
      indicators.push(this.stringCapitalAndNoFinalS(ind));
    }
    return indicators;
  }

  getOthers(nr: number) {
    return (this.i + nr) % this.collections;
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  navigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      this.ScrollTop();
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  navigateToMarque(newMarque: string) {
    this.router.navigate(['/marque', newMarque]);
    window.scrollTo(0, 0);

    this.route.params.subscribe(params => {
      this.marque = params['marque'];
    });

    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });
  }

  download(marque: string, type: string) {
    // NOT WORKING FOR IE
    this.downloader.getFile(marque, type).subscribe(data => {
      this.blob = new Blob([data], {
        type: 'application/pdf'
      });
      const fileName = marque[0].toUpperCase() + marque.slice(1) + ' ' + type[0].toUpperCase() + type.slice(1) + '.pdf';
      FileSaver.saveAs(this.blob, fileName);
      // this.url = window.URL.createObjectURL(this.blob);
      // window.open(this.url, '_blank');
    });
  }

  goAllProductsOfBrand(marque: string) {
    const brand = this.collectionsText[this.collectionsLink.findIndex(x => x === marque)];
    this.router.navigate(['product/productSearch', { b: brand }]);
  }

  goProductsByCategoryOrFamily(marque: string, param: string) {
    const brand = this.collectionsText[this.collectionsLink.findIndex(x => x === marque)];
    param = this.stringCapitalAndNoFinalS(param);
    const categories = ['ASSISE', 'MEUBLE', 'LUMINAIRE', 'ACCESSOIRE', 'SEATING',
                        'FURNITURE', 'LIGHTING', 'ACCESSORY', 'TABLE'];
    if (categories.includes(param.toUpperCase())) {
      this.router.navigate(['product/productSearch', { b: brand, c: param }]);
     } else {
      this.router.navigate(['product/productSearch', { b: brand, f: param }]);
     }
  }

  stringCapitalAndNoFinalS(str: string): string {
    if (str.substr(str.length - 3).toLowerCase() === 'ies') {
      str = str.slice(0, -3).concat('y');
    }
    if (str.substr(str.length - 1).toLowerCase() === 's') {
      str = str.slice(0, -1);
    }
    str = _.startCase(_.toLower(str));
    return str;
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }
}
