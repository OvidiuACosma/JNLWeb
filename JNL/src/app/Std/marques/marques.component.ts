import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExchangeService, TranslationService, AltImgService } from '../../_services';
import {trigger,state,style,animate,transition}from '@angular/animations';
declare var $: any;

@Component({
  selector: 'app-marques',
  templateUrl: './marques.component.html',
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(1200)
      ])
    ])
  ]
})
export class MarquesComponent implements OnInit, AfterViewInit, AfterViewChecked {

  public marque: string;
  language: string;
  text: any;
  anchor: number;

  altText: any;
  page = 'marques';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private altService: AltImgService) { }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   this.marque = params['marque'];
    // });
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
      this.getAlt(this.page);
    });
  }

  getText(lang: string) {
    this.textService.getTextMarques()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
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

  ngAfterViewInit() {
    this.anchor = 1;
  }

  ngAfterViewChecked() {
    // this.anchor <= 2 - ensures it pass the code 2 times, otherwise no scroll to anchor happens
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
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  navigateTo(target: string, fragment: string = '') {
    this.anchor = 2; // trick: force navigation to actual fragment, and stop reprocessing on ngAfterViewChecked
    if (fragment === '') {
      this.router.navigate([target]);
      this.scrollTop();
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  navigateToMarque(marque: string) {
    this.scrollTop();
    this.router.navigate(['/marque', marque]);
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
