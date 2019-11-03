import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService, AuthenticationService, DownloaderService } from '../../_services';
import { Browser, User } from '../../_models';
import { AuthGuard } from 'src/app/_guards';
import { mergeMap, map } from 'rxjs/operators';

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
  textAllLanguages: any;
  text: any;
  searchMode = false;
  navBarStatus = true;
  navBarButtonSrc = '/assets/Images/Menu/menuOpen.png';
  isHome: boolean;
  browser: Browser;
  currentUser: User;
  userOptionsVisible = false;
  userOptions: string[];
  loginText: string;

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private authGuard: AuthGuard,
              private autenticationService: AuthenticationService,
              private downloaderService: DownloaderService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataex.currentUser.pipe(
      mergeMap(user => this.dataex.currentNavBarStatus.pipe(
        mergeMap(navBarStatus => this.dataex.currentBrowser.pipe(
          mergeMap(browser => this.router.events.pipe(
            mergeMap(router => this.dataex.currentLanguage.pipe(
              mergeMap(lang => this.textService.getTextSearch().pipe(
                map(text => ({
                  user: user,
                  navBarStatus: navBarStatus,
                  browser: browser,
                  router: router,
                  lang: lang,
                  text: text
                }))
              ))
            ))
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.currentUser = resp.user;
      this.navBarStatus = resp.navBarStatus;
      this.browser = resp.browser;
      this.isHome = (this.router.url === '/' || this.router.url === '/home') ? true : false;
      this.language = resp.lang || 'EN';
      this.otherLanguages = this.languages.filter(f => !f.includes(this.language));
      this.textAllLanguages = resp.text;
      this.text = this.getText(this.language);
    });
    this.checkUser(this.currentUser);
    this.getUserOptions(this.currentUser);
  }

  checkUser(user: User) {
    const userLocal: User = JSON.parse(localStorage.getItem('currentUser'));
    if (userLocal && this.currentUser !== userLocal) {
      this.dataex.setCurrentUser(userLocal);
      this.getUser();
    }
  }

  getUserOptions(user: User) {
    this.getLogInText();
    this.userOptions = [];
    if (this.loginText === 'log out') {
      this.userOptions.push('Favorites');
      if (['A', 'C', 'R'].includes(user.type)) {
        this.userOptions.push('Price list');
      }
      if (user.type === 'A') {
        this.userOptions.push('Add login');
      }
      this.userOptions.push('Log out');
    }
  }

  getText(lang: string): any {
    return this.textAllLanguages[0][lang.toUpperCase()];
  }

  getUser() {
    this.dataex.currentUser
    .subscribe(user => {
      this.currentUser = user;
      this.getUserOptions(user);
    });
  }

  getLogInText() {
    this.loginText = this.isLoggedIn() ? 'log out' : 'log in';
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
    this.text = this.getText(lang);
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

  isLoggedIn(): boolean {
    return this.authGuard.isLoggedIn();
  }

  logIn() {
    this.authGuard.logIn();
    this.getUser();
  }

  logOut() {
    this.autenticationService.logout();
    this.getLogInText();
  }

  toggleUserOptionsMenu() {
    this.userOptionsVisible = !this.userOptionsVisible;
  }

  userOptionClick(option: string) {
    switch (option.toLowerCase()) {
      case 'log out': {
        this.logOut();
        break;
      }
      case 'add login' : {
        this.navigateTo('register');
        break;
      }
      case 'price list': {
        this.downloaderService.priceListRequest(this.language, 'all');
        break;
      }
      case 'favorites': {
        this.navigateTo('product/favorites/0');
        break;
      }
    }
    this.toggleUserOptionsMenu();
  }
}
