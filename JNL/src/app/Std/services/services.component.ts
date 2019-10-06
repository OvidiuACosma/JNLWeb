
import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, AltImgService } from '../../_services';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, AfterViewInit, AfterViewChecked {

  language: string;
  text: any;
  selected = [0, 0, 0, 0];
  scroller = true;
  anchor: number;

  altText: any;
  page = 'services';

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
  }

  getText(lang: string) {
    this.textService.getTextServices()
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

  selectMarque(nr: number) {
    if (this.selected[nr] === 1) {
      this.selected[nr] = 0;
    } else {
      this.selected[nr] = 1;
    }
    this.scroller = false;
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
          this.scroller = true;
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
