import { Component, OnInit, AfterViewChecked, OnChanges } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DataExchangeService, TranslationService } from 'src/app/_services';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrls: ['./actualite.component.css']
})
export class ActualiteComponent implements OnInit {

  language: string;
  text: any;
  nr: string;
  public actual: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

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

  navigateToActualite(changer: string) {
    this.nr = '' + (Number(this.actual) + changer);
    this.router.navigate(['actualites', {a: this.nr}]);
    this.ngOnInit();
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
}
