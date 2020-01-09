import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertService, UserService, DataExchangeService, TranslationService } from 'src/app/_services';
import { IUserResetPassword } from 'src/app/_models';
import { mergeMap, map } from 'rxjs/operators';

function duplicatePassword(input: FormControl) {
  if (!input.root.get('newPassword')) {
    return null;
  }
  const exactMatch = input.root.get('newPassword').value === input.value;
  return exactMatch ? null : { mismatchedPassword: true };
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  token: string;
  resetFormG: FormGroup;
  loading = false;
  submitted = false;
  language: string;
  text: any;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private alertService: AlertService,
              private dataex: DataExchangeService,
              private translationService: TranslationService) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p.token) {
        this.token = p.token;
      }
    });
    this.getData();
    this.resetForm();
  }

  getData() {
    this.dataex.currentLanguage.pipe(
      mergeMap(lang => this.translationService.getTextAuth().pipe(
        map(text => ({
          lang: lang,
          text: text
        }))
      ))
    )
    .subscribe(resp => {
      this.language = resp.lang;
      this.text = resp.text[0]['resetPasswordComponent'][this.language.toUpperCase()] || [];
    });
  }

  resetForm() {
    this.resetFormG = this.formBuilder.group({
      newPassword: ['', [Validators.required,
                        Validators.minLength(8),
                        Validators.maxLength(20),
                        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,30}')]],
                        // this is for the letters (both uppercase and lowercase) and numbers validation
      newPasswordC: ['', [Validators.required, duplicatePassword]]
    });
  }

  get f() { return this.resetFormG.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.resetFormG.invalid) { return; }
    this.loading = true;
    const userResetPassword: IUserResetPassword = {
      token: this.token,
      password: this.resetFormG.value.newPassword
    };
    this.userService.resetPassword(userResetPassword)
    .subscribe(response => {
      this.alertService.success(response);
    });
    this.loading = false;
  }
}
