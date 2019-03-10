import { Component, OnInit, AfterViewChecked, OnChanges } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DataExchangeService, TranslationService } from 'src/app/_services';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-marque',
  templateUrl: './marque.component.html',
  styleUrls: ['./marque.component.css']
})
export class MarqueComponent implements OnInit, OnChanges {

  language: string;
  text: any;
  collectionsText = ['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'Luz Interiors'];
  collectionsLink = ['jnl', 'vanhamme', 'ungaro', 'luz'];
  othersText: string[];
  othersLink: string[];
  i: number;
  collections: number;
  public marque: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

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
    });
    // activate carousel
    $(document).ready(function() {
      $('.carousel').carousel();
    });
  }

  ngOnChanges() {
    // console.log('CHANGE!');
  }

  getText(lang: string) {
    this.textService.getTextMarque()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()][this.marque.toUpperCase()];
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

  ScrollTop() {
    window.scrollTo(0, 0);
  }
}
