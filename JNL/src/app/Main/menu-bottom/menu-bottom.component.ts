import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService } from 'src/app/_services';

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrls: ['./menu-bottom.component.css']
})
export class MenuBottomComponent implements OnInit {

  language: string;
  text: any;

  constructor(private router: Router,
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
    this.textService.getTextMenu()
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
  }

  NavigateTo(target: string, fragment: string = '') {
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
