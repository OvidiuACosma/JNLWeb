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
  navBarButtonSrc: string;
  navBarButtonText: string;

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

  ngOnInit() {
    this.dataex.currentNavBarStatus
    .subscribe(status => {
      this.navBarStatus = status;
      this.navBarButtonSrc = '/assets/Images/Menu/menuOpen.png';
      this.navBarButtonText = 'MENU';
    });
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      // this.languages = this.languages.filter(f => !f.includes(this.language)); // against HTML slect > option philisophy
      // TODO: implemet horizontal face select
      this.getText(this.language);
    });
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
    switch (this.navBarStatus) {
      case false: {
        this.navBarButtonSrc = '/assets/Images/Menu/menuOpen.png';
        this.navBarButtonText = 'MENU';
        break;
      }
      case true: {
        this.navBarButtonSrc = '/assets/Images/Menu/menuClose.png';
        this.navBarButtonText = 'CLOSE';
        break;
      }
    }
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }

  getNavbarButton() {
    switch (this.navBarStatus) {
      case false: {
        return '&#9776;';
        // return '/assets/Images/Menu/menuOpen.png';
      }
      case true: {
        return '&#10005;';
        // return '/assets/Images/Menu/menuClose.png';
      }
    }
  }

  onChangeLanguage(lang: any) {
    this.language = lang;
    this.dataex.setLanguage(lang);
    this.getText(this.language);
  }
}
