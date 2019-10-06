import { Component, OnInit, Output, EventEmitter, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService } from '../../_services';
import { Browser, User } from '../../_models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  language: string;
  otherLanguages: string[];
  languages: string[] = ['EN', 'FR'];
  isLangSelectMode = false;
  text: any;
  searchMode = false;
  navBarStatus = true;
  navBarButtonSrc = '/assets/Images/Menu/menuOpen.png';
  navBarButtonText: string;
  isHome: boolean;
  browser: Browser;
  currentUser: User;
  userType: string = null;

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService) {}

  ngOnInit() {
    this.dataex.currentNavBarStatus
    .subscribe(status => {
      this.navBarStatus = status;
      this.navBarButtonSrc = '/assets/Images/Menu/menuOpen.png';
      this.navBarButtonText = 'MENU';
    });
    this.dataex.currentBrowser
    .subscribe(browser => this.browser = browser);
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.otherLanguages = this.languages.filter(f => !f.includes(this.language));
      this.getText(this.language);
    });
    this.router.events.subscribe(r => {
      this.isHome = (this.router.url === '/' || this.router.url === '/home') ? true : false;
    });

    this.getUser();
    const userLocal: User = JSON.parse(localStorage.getItem('currentUser'));
    if (userLocal && this.currentUser !== userLocal) {
      this.resetUser(userLocal);
      this.getUser();
    }
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

  getUser() {
    this.dataex.currentUser
    .subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.userType = user.type;
      }
    });
  }

  resetUser(user: User) {
    this.dataex.setCurrentUser(user);
  }

  goSearchMode() {
    this.searchMode = !this.searchMode;
  }

  doSearch(searchText: string) {
    this.searchMode = !this.searchMode;
    if (searchText) {
    this.router.navigate(['product/productSearch', { s: searchText }]);
    this.scrollTop();
    }
  }

  goHome() {
    this.dataex.setNavBarStatus(false);
    this.router.navigate(['/home']);
    this.scrollTop();
  }

  toggleNav() {
    // Hover - Desktop
    if (event.type === 'mouseover' && this.browser.isDesktopDevice) {
      // Avoid flickering
      if (!this.navBarStatus) {
        this.dataex.setNavBarStatus(!this.navBarStatus);
      }
    }  else if (event.type === 'click') { // Click - Mobile
      if (this.browser.isTablet || this.browser.isMobile || (this.browser.isDesktopDevice && window.innerWidth <= 768)) {
        this.dataex.setNavBarStatus(!this.navBarStatus);
      }
    }
  }

  scrollTop() {
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
    if (this.isLangSelectMode) {
      this.toggleLangStatus();
    }
  }

  toggleLangStatus() {
    this.isLangSelectMode = ! this.isLangSelectMode;
  }

  navigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      window.scrollTo(0, 0);
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  closeLangSelection() {
    if (this.isLangSelectMode) {
      this.toggleLangStatus();
    }
  }
}
