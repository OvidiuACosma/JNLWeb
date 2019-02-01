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
  othersText = ['JNL Collection', 'Vanhamme', 'Luz Interiors', 'Emanuel Ungaro Home'];
  othersLink = ['jnl', 'vanhamme', 'luz', 'ungaro'];

  public marque: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.marque = params['marque'];
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
    // switch (this.language) {
    //     case 'EN': {
    //       console.log('Marque JSON: ', res['EN'][this.marque.toUpperCase()]);
    //       this.text = res['EN'];
    //       break;
    //       }
    //     case 'FR': {
    //       this.text = res['FR'];
    //       break;
    //     }
    //     default: {
    //       this.text = res['EN'];
    //       break;
    //     }
    //   }
  }

  getOthers(nr: number) {
    if (this.othersLink[nr] === this.marque) {
        return 3;
    } else {
      return nr;
    }
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
