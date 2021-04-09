import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, DownloaderService, AltImgService } from '../../_services';
import * as _ from 'lodash';

interface ICatalog {
  brand: string;
  catalogLink: string;
}

@Component({
  selector: 'app-press',
  templateUrl: './press.component.html',
  styleUrls: ['./press.component.scss']
})
export class PressComponent implements OnInit, AfterViewInit, AfterViewChecked {

  public section: string;
  language: string;
  text: any[];
  textCatalog: any[];
  textInspiration: any[];
  textReview: any[];
  collectionsText = ['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'JNL Studio'];
  collectionsLink = ['jnl', 'vanhamme', 'ungaro', 'studio'];
  catalogs: ICatalog[] = [];
  scroller = true;
  anchor: number;
  blob: any;
  url: any;
  altText: any;
  page = 'press';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private downloader: DownloaderService,
              private altService: AltImgService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.section = params['section'];
    });

    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
      this.getAlt(this.page);
    });
    this.getCatalogLinks();
  }

  getText(lang: string) {
    this.textService.getTextPresse()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.textCatalog = [];
    this.textInspiration = [];
    this.textReview = [];
    this.text = res[this.language.toUpperCase()]['Generic'];
    const tc = res[this.language.toUpperCase()]['Catalog'];
    for (let c = 0; c < 4; c++) {
      this.textCatalog.push([ tc.id[c], tc.coll[c], tc.imgSrc[c], tc.imgAlt[c]]);
    }
    this.textCatalog = _.orderBy(this.textCatalog, this.textCatalog[0], 'asc');
    const ti = res[this.language.toUpperCase()]['Inspiration'];
    for (let i = 0; i < 4; i++) {
      this.textInspiration.push([ti.id[i], ti.coll[i], ti.imgSrc[i], ti.imgAlt[i], ti.imgLogoSrc[i], ti.imgLogoAlt[i]]);
    }
    this.textInspiration = _.orderBy(this.textInspiration, this.textInspiration[0], 'asc');
    const tp = res[this.language.toUpperCase()]['Review'];
    for (let p = 0; p < 4; p++) {
      this.textReview.push([ tp.id[p], tp.coll[p], tp.imgSrc[p], tp.imgAlt[p]]);
    }
    this.textReview = _.orderBy(this.textReview, this.textReview[0], 'asc');
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

  getCatalogLinks() {
    this.catalogs.push({ brand: 'JNL Collection',
                  catalogLink: 'https://drive.google.com/file/d/17VZXNGcpKvwN4Ts-VMMC1a8u9zsL1yJ2/view?usp=sharing' });
    this.catalogs.push({ brand: 'Vanhamme',
                  catalogLink: 'https://drive.google.com/file/d/1qN1_--FtTb1TZnMKEdyt1p8VlfOmv3nU/view?usp=sharing' });
    this.catalogs.push({ brand: 'Emanuel Ungaro Home',
                  catalogLink: 'https://drive.google.com/file/d/1Es70xbDoKdyuElATLMeaWNJFl4hVH_4K/view?usp=sharing' });
    this.catalogs.push({ brand: 'JNL Studio',
                  catalogLink: 'https://drive.google.com/file/d/1LRv-rBMCxl_MKshUrfI9LkBjVcR9Mcxd/view?usp=sharing' });
  }

  // download(marque: string, type: string) {
  //   this.downloader.getFile(marque, type).subscribe(data => {
  //     this.blob = new Blob([data], {
  //       type: 'application/pdf'
  //     });
  //     const brand = this.collectionsText[this.collectionsLink.findIndex(f => f === type)];
  //     // const fileName = brand[0].toUpperCase() + brand.slice(1) + ' ' + type[0].toUpperCase() + type.slice(1) + '.pdf';
  //     const fileName = marque[0].toUpperCase() + marque.slice(1) + ' ' + type[0].toUpperCase() + type.slice(1) + '.pdf';
  //     FileSaver.saveAs(this.blob, fileName);
  //   });
  //   this.scroller = false;
  // }

  download(marque: string, type: string) {
      marque = this.collectionsText[this.collectionsLink.indexOf(marque)];
      const catalogUrl = this.catalogs.find(f => f.brand === marque).catalogLink;
      const a = document.createElement('a');
      a.href = catalogUrl;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.setAttribute('visibility', 'hidden');
      a.click();
  }

  goAllProductsOfBrand(marque: string) {
    const brand = this.collectionsText[this.collectionsLink.findIndex(x => x === marque)];
    this.router.navigate(['product/pSearch', { b: brand }]);
  }

  ngAfterViewInit() {
    this.anchor = 1;
  }

  ngAfterViewChecked() {
    if (this.anchor <= 2) {
      this.route.fragment.subscribe(fragment => {
        if (fragment) {
          this.navigateToAnchor(fragment);
          this.anchor++;
        } else {
            this.scrollTop();
            this.anchor++;
          }
      });
    }
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element &&  this.scroller === true) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
    this.scroller = true;
  }

  navigateTo(target: string, fragment: string = '') {
    this.anchor = 2;
    if (fragment === '') {
      this.router.navigate([target]);
      this.scrollTop();
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  closeModal() {
  }
}
