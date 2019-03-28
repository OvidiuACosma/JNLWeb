import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService, RequestsService } from 'src/app/_services';
import { FormControl } from '@angular/forms';
import { RequestForm } from 'src/app/_models';

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrls: ['./menu-bottom.component.css']
})
export class MenuBottomComponent implements OnInit {

  language: string;
  text: any;
  email = new FormControl('');

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private requestService: RequestsService) {}

  ngOnInit() {
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

  registerForNewsletter() {
    const formReq = new RequestForm();
    formReq.email = this.email.value;
    this.requestService.postRequest(formReq)
    .subscribe();
    window.alert(`${this.email.value} - Thank you for subscribing to our newsletter.`);
    // TODO: validate email is yours procedure (send an email with a link, process the link and validate)
  }
}
