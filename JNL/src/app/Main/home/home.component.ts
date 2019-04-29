import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DataExchangeService, TranslationService, AltImgService } from '../../_services';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  language: string;
  text: any;
  altText: any;
  page = 'home';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private altService: AltImgService) {
  }

  ngOnInit() {
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText();
      this.getAlt();
      this.ScrollTop();
    });
    // activate carousel
    $(document).ready(function() {
      $('.carousel').carousel();
    });
  }

  getText() {
    this.textService.getTextHome()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
  }

  getAlt() {
    this.altService.getAltImages()
    .subscribe(data => {
      const res = data[0];
      this.altText = this.getAltText(res, this.page);
    });
  }

  getAltText(res: any, page: string): any {
    return res[page];
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  navigateToActualite(actualite: string) {
    this.router.navigate(['actualites', {a: actualite}]);
    this.ScrollTop();
  }

  navigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      this.ScrollTop();
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }

  log(index: number) {
    console.log('Active Slide:', index);
  }
}
