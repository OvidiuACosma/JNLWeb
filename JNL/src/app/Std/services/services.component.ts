
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DataExchangeService, TranslationService } from 'src/app/_services';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, AfterViewChecked {


  language: string;
  text: any;
  selected = [0, 0, 0, 0];
  scroller = true;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

  ngOnInit() {
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });

  }

  getText(lang: string) {
    this.textService.getTextServices()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
    // switch (this.language) {
    //     case 'EN': {
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
    //   console.log('Home text:' , this.text);
  }

  selectMarque(nr: number) {
    if (this.selected[nr] === 1) {
      this.selected[nr] = 0;
    } else {
      this.selected[nr] = 1;
    }

    this.scroller = false;
  }

  ngAfterViewChecked() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element && this.scroller === true ) {
          element.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
        this.scroller = true;
      } else if (this.scroller === true) {
          window.scrollTo(-100, 0);
        }
    });
  }

}
