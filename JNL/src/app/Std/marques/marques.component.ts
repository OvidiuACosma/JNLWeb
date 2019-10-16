import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExchangeService, TranslationService, AltImgService } from '../../_services';
import { concatMap, mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-marques',
  templateUrl: './marques.component.html',
  styleUrls: ['./marques.component.scss']
})
export class MarquesComponent implements OnInit/*, AfterViewInit, AfterViewChecked*/ {

  language: string;
  text: any;
  anchor: number;
  altText: any;
  page = 'marques';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private altService: AltImgService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataex.currentLanguage.pipe(
      concatMap(lang => this.textService.getTextMarques().pipe(
        mergeMap(textMarques => this.altService.getAltImages().pipe(
          map(altImages => ({
            lang: lang,
            textMarques: textMarques,
            altImages: altImages
          }))
        ))
      ))
    )
    .subscribe(resp => {
      this.language = resp.lang || 'EN';
      this.text = resp.textMarques[0][this.language.toUpperCase()];
      this.altText = resp.altImages[0][this.page];
    });
  }

  // ngAfterViewInit() {
  //   this.anchor = 1;
  // }

  // ngAfterViewChecked() {
  //   // this.anchor <= 2 - ensures it pass the code 2 times, otherwise no scroll to anchor happens
  //   if (this.anchor <= 2) {
  //     this.route.fragment.subscribe(fragment => {
  //       if (fragment) {
  //         this.navigateToAnchor(fragment);
  //         this.anchor++;
  //       } else {
  //           this.scrollTop();
  //           this.anchor++;
  //         }
  //     });
  //   }
  // }

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
