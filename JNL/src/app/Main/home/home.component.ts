import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DataExchangeService, TranslationService } from 'src/app/_services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  language: string;
  text: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
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

  ScrollTop() {
    window.scrollTo(0, 0);
  }

  log(index: number) {
    console.log('Active Slide:', index);
  }
}
