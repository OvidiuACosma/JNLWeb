import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataExchangeService, TranslationService } from 'src/app/_services';

@Component({
  selector: 'app-marques',
  templateUrl: './marques.component.html',
  styleUrls: ['./marques.component.css']
})
export class MarquesComponent implements OnInit, AfterViewChecked {

  public marque: string;

  language: string;
  text: any;


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
      this.language = lang;
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
    switch (this.language) {
        case 'EN': {
          this.text = res['EN'];
          break;
          }
        case 'FR': {
          this.text = res['FR'];
          break;
        }
        default: {
          this.text = res['EN'];
          break;
        }
      }
      console.log('Home text:' , this.text);
  }


  ngAfterViewChecked() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.navigateToAnchor(fragment);
      } else {
          window.scrollTo(0, 0);
        }
    });
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  navigateToMarque(marque: string) {
    this.router.navigate(['/marque', marque]);
    window.scrollTo(0, 0);
  }
}
