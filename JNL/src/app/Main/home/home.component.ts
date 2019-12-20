import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExchangeService, TranslationService, AltImgService, AlertService } from '../../_services';
import { mergeMap, map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
              private altService: AltImgService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.getData();
    this.scrollTop();
    if (!this.testBrowser()) { this.alertBrowserIE(); }
    $(document).ready(function() {
      $('.home-first-picture').animate({
        opacity : 1
      }, 700);
    });
  }

  getData() {
      this.dataex.currentLanguage.pipe(
        mergeMap(lang => this.textService.getTextHome().pipe(
          mergeMap(text => this.altService.getAltImages().pipe(
            map(alt => ({
              lang: lang,
              text: text,
              alt: alt
            })
          ))
        ))
      ))
    .subscribe(resp => {
      this.language = resp.lang || 'EN';
      this.text = resp.text[0][this.language.toUpperCase()];
      this.altText = resp.alt[0][this.page];
    });
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  navigateToActualite(actualite: string) {
    this.router.navigate(['actualites', {a: actualite}]);
    this.scrollTop();
  }

  navigateTo(target: string, fragment: string = '') {
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

  testBrowser(): boolean {
    const ua = window.navigator.userAgent;
    let msie = ua.indexOf('MSIE ');

    // IE 10 or older
    if (msie > 0) { return false; }

    // IE 11
    msie = ua.indexOf('Trident/');
    if (msie > 0) { return false; }
    return true;
  }

  alertBrowserIE() {
    let message = 'Partial Incompatibility for MS Internet Explorer detected!.\n\n';
    message = message + 'For a full enjoyable experience,\n';
    message = message + 'please open the page with one of the modern, evergreen browsers:\n';
    message = message + '(Google Chrome, Microsoft Edge, Firefox, Safari).';
    message = message.replace(/\n/g, '<br />');
    this.alertService.error(message);
  }
}
