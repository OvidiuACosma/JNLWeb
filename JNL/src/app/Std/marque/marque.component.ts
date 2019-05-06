import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExchangeService, TranslationService, AltImgService, DownloaderService } from '../../_services';
import * as _ from 'lodash';
declare var $: any;

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
    // activate carousel
    $(document).ready(function() {
      $('.carousel').carousel();
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

  download(marque: any, type: any) {
    // NOT WORKING FOR IE AND EDGE
    this.downloader.getFile(marque, type).subscribe(data => {
      this.blob = new Blob([data], {
        type: 'application/pdf'
      });
      this.url = window.URL.createObjectURL(this.blob);
      window.open(this.url, '_blank');
    });
  }

  goAllProducts(marque: string) {
    const brand = this.collectionsText[this.collectionsLink.findIndex(x => x === marque)];
    this.router.navigate(['products', { b: brand }]);
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }
}
