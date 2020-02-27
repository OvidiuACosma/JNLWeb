import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataExchangeService, TranslationService } from 'src/app/_services';
import { IUserResetPassword } from 'src/app/_models';
import { mergeMap, map } from 'rxjs/operators';
import { UserService } from 'src/app/_services/user.service';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'src/app/Main/common-dialog/common-dialog.component';

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
              private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private authGuard: AuthGuard,
              private dataex: DataExchangeService,
              private translationService: TranslationService,
              private dialog: MatDialog) { }

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
      this.confirmPasswordReset();
    });
    this.loading = false;
  }

  confirmPasswordReset() {
    const answerTitle = 'Reset password';
    const answerText = `Your password has been reset.\n
                        Please login using your new password.\n
                        Thank you!`;
    this.openDialog(answerTitle, answerText, [0]);
  }

  openDialog(answerTitle: string, answerText: string, buttons: number[] = [0]) {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '400px',
      data: {
        title: answerTitle,
        text: answerText,
        buttons: buttons
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.authGuard.logIn();
      this.router.navigate(['']);
    });
    return;
  }
}
