import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService, AuthenticationService } from 'src/app/_services';
import { Browser } from '../../_models';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  language: string;
  text: any;
  isCollapsed = false;

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.dataex.currentNavBarStatus
    .subscribe(status => {
      this.isCollapsed = !status;
    });

    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });
    $(document).ready(function() {
        $('.js-fadein').animate({
            opacity : 1
          }, 700);
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
    this.text = res[this.language.toUpperCase()];
  }

  toggleMenuBar() {
    this.dataex.setNavBarStatus(this.isCollapsed);
  }

  goProducts() {
    this.router.navigate(['/products']);
    this.toggleMenuBar();
  }

  isLoggedIn(): boolean {
      if (localStorage.getItem('currentUser')) {
        return true;
      }
      return false;
    }

  signOut() {
    this.NavigateTo('home');
    this.authenticationService.logout();
  }

  NavigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      this.ScrollTop();
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
    this.toggleMenuBar();
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }

  hideMenu() {
    if (!this.isCollapsed) {
      this.toggleMenuBar();
    }
  }
}
