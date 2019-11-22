import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExchangeService, TranslationService } from 'src/app/_services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrls: ['./actualite.component.scss']
})
export class ActualiteComponent implements OnInit {

  language: string;
  text: any;
  // nr: string;
  public actual: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private location: Location) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.actual = params.get('a');
    });

    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });
  }

  getText(lang: string) {
    this.textService.getTextActualite()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()][this.actual];
  }

  // navigateToActualite(changer: string) {
  //   this.nr = '' + (Number(this.actual) + changer);
  //   this.router.navigate(['actualites', {a: this.nr}]);
  //   this.ngOnInit();
  //   this.ScrollTop();
  // }

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

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.navigateTo('home');
    }
  }

  download() {
    const catalogUrl = 'https://managerdelannee.be/wp-content/uploads/1-FR-Alain-Lahy.pdf';
    const a = document.createElement('a');
    a.href = catalogUrl;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.setAttribute('visibility', 'hidden');
    a.click();
  }
}
