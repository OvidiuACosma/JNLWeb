import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService, TranslationService, RequestsService } from 'src/app/_services';
import { FormControl, Validators } from '@angular/forms';
import { RequestForm } from 'src/app/_models';

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrls: ['./menu-bottom.component.css']
})
export class MenuBottomComponent implements OnInit {

  language: string;
  text: any;
  email: FormControl;

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
    this.emailReset();
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
        // TODO: validate 'email is yours procedure' (send an email with a link, process the link and validate in DB)
      }
    }
  }
}
