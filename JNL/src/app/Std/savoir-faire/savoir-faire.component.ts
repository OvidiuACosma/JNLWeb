import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, AltImgService } from '../../_services';
declare var $: any;

@Component({
  selector: 'app-savoir-faire',
  templateUrl: './savoir-faire.component.html',
  styleUrls: ['./savoir-faire.component.scss']
})
export class SavoirFaireComponent implements OnInit, AfterViewInit, AfterViewChecked {

  language: string;
  text: any;
  anchor: number;

  altText: any;
  page = 'savoir';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private altService: AltImgService) { }

  ngOnInit() {
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
    this.textService.getTextSavoir()
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
}
