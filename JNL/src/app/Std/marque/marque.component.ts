import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService } from 'src/app/_services';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-marque',
  templateUrl: './marque.component.html',
  styleUrls: ['./marque.component.css']
})
export class MarqueComponent implements OnInit {

  language: string;
  text: any;
  othersText = ['JNL Collection', 'Vanhamme', 'Emanuel Ungaro Home', 'Luz Interiors'];
  othersLink = ['jnl', 'vanhamme', 'ungaro', 'luz'];
  i: number;

  public marque: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.marque = params['marque'];
      this.i = this.othersLink.indexOf(this.marque);
      this.othersLink.splice(this.i, 1);
      this.othersText.splice(this.i, 1);
      this.i = this.i % this.othersLink.length;
    });

    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
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
    this.text = res[this.language.toUpperCase()][this.marque.toUpperCase()];
  }

  getOthers(nr: number) {
    return (this.i + nr) % this.othersLink.length;
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
