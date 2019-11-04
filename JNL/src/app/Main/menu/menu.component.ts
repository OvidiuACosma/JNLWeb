import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService, AuthenticationService } from 'src/app/_services';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  language: string;
  text: any;
  isCollapsed = true;

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataex.currentNavBarStatus.pipe(
      mergeMap(status => this.dataex.currentLanguage.pipe(
        mergeMap(lang => this.textService.getTextMenu().pipe(
          map(text => ({
            status: status,
            lang: lang,
            text: text
          }))
        ))
      ))
    )
    .subscribe(resp => {
      this.isCollapsed = !resp.status;
      this.language = resp.lang || 'EN';
      this.text = resp.text[0][this.language.toUpperCase()];
    });
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
    this.toggleMenuBar();
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

  hideMenu() {
    if (!this.isCollapsed) {
      this.toggleMenuBar();
    }
  }
}
