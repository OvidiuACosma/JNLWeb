import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DataExchangeService, TranslationService } from 'src/app/_services';

@Component({
  selector: 'app-savoir-faire',
  templateUrl: './savoir-faire.component.html',
  styleUrls: ['./savoir-faire.component.css']
})
export class SavoirFaireComponent implements OnInit, AfterViewChecked {

  language: string;
  text: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

  ngOnInit() {
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang;
      this.getText(lang);
    });
  }

  getText(lang: string) {
    this.textService.getTextHome()
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
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
      } else {
          window.scrollTo(0, 0);
        }
    });
  }

}
