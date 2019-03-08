import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExchangeService, TranslationService } from 'src/app/_services';

@Component({
  selector: 'app-marques',
  templateUrl: './marques.component.html',
  styleUrls: ['./marques.component.css']
})
export class MarquesComponent implements OnInit, AfterViewInit, AfterViewChecked {

  public marque: string;
  language: string;
  text: any;
  anchor: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   this.marque = params['marque'];
    // });
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
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
    this.router.navigate(['/marque', marque]);
    this.scrollTop();
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
