import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService } from 'src/app/_services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnChanges {

  language: string;
  text: any;
  isCollapsed = false;

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService) { }

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

  ngOnChanges() {
    // this.toggleMenuBar();
  }

  toggleMenuBar() {
    this.dataex.setNavBarStatus(this.isCollapsed);
  }

  goProducts() {
    this.router.navigate(['/products']);
    this.toggleMenuBar();
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
}
