import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService, RequestsService } from '../../_services';
import { FormControl, Validators } from '@angular/forms';
import { RequestForm } from '../../_models';
import { map, mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrls: ['./menu-bottom.component.scss']
})
export class MenuBottomComponent implements OnInit {

  language: string;
  text: any;
  email: FormControl;
  isMobile = false;

  constructor(private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private requestService: RequestsService) {}

  ngOnInit() {
    this.getData();
    this.emailReset();
  }

  getData() {
    this.dataex.currentBrowser.pipe(
      mergeMap(browser => this.dataex.currentLanguage.pipe(
        mergeMap(lang => this.textService.getTextMenu().pipe(
          map(text => ({
            browser: browser,
            lang: lang,
            text: text
          }))
        ))
      ))
    )
    .subscribe(resp => {
      this.isMobile = !resp.browser.isMobile;
      this.language = resp.lang || 'EN';
      this.text = resp.text[0][this.language.toUpperCase()];
    });
  }

  emailReset() {
    this.email = new FormControl('', [Validators.email]);
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
    formReq.type = 1;
    if (this.email.touched && this.email.dirty) {
      if (this.email.invalid) {
        if (this.email.errors.email) {
          window.alert(`Please enter a valid email address.\n${this.email.value} - is not a valid one.`);
        } else {
          window.alert('Uups...something went wrong. Please submit your email again.');
          // TODO: implement logging for the unexpected error
        }
      } else {
        this.requestService.postRequest(formReq)
        .subscribe(); // TODO: check for duplicate email. If exists and not validated -> send validation email.
                      // If existent and validated, inform the existence.
        window.alert(`${this.email.value} - Thank you for subscribing to our newsletter.\n
                      A verification email will be sent to you to confirm this is your email address.\n
                      Please click on the link provided in the email to validate your subscription.`);
        this.emailReset();
        // TODO: validate 'email is yours' procedure (send an email with a link, process the link and validate in DB)
      }
    }
  }
}
