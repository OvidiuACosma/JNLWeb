import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService } from 'src/app/_services';
import { Target } from '@angular/compiler';
import { getRenderedText, text } from '@angular/core/src/render3';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() toggleNavBar = new EventEmitter();

  public language: string;
  languages: string[] = ['EN', 'FR'];
  public text: any;
  public searchMode = false;
  public navBarStatus = true;

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

  ngOnInit() {
    this.dataex.currentNavBarStatus
    .subscribe(status => this.navBarStatus = status);
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      // this.getText(lang);
    });
    this.getText(this.language);
  }

  getText(lang: string) {
    this.textService.getTextSearch()
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
  }

  goSearchMode() {
    this.searchMode = !this.searchMode;
  }

  doSearch(searchText: string) {
    this.searchMode = !this.searchMode;
    if (searchText) {
    this.router.navigate(['/searchResults', searchText]);
    this.ScrollTop();
    }
  }

  goHome() {
    this.dataex.setNavBarStatus(false);
    this.router.navigate(['/home']);
    this.ScrollTop();
  }

  toggleNav() {
    this.toggleNavBar.emit(null);
    this.dataex.setNavBarStatus(!this.navBarStatus);
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }

  getNavbarButton() {
    switch (this.navBarStatus) {
      case false: {
        return '&#9776;';
      }
      case true: {
        return '&#10005;';
      }
    }
  }

  onChangeLanguage(lang: any) {
    this.language = lang;
    this.dataex.setLanguage(lang);
    this.getText(this.language);
  }
}
