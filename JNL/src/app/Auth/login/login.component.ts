import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/_services/alert.service';
import { DialogService } from 'src/app/_services/dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  success = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private dialogService: DialogService,
              public dialogRef: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string
              ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.authenticationService.logout();
    this.returnUrl = this.data;
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.success = false;
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.success = true;
          this.close();
          if (this.returnUrl !== '') {
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  close(): void {
    this.dialogRef.close(this.success);
  }

  forgotPassword() {
    this.authenticationService.forgotPassword(this.loginForm.value.username.toString())
    .subscribe(resp => {
      const answerTitle = 'Reset password email sent';
      const answerText = `Your request has been registered.\n
                    An email with a link to reset your password has been sent to you.\n
                    Follow the link to change your password.\n\n
                    Thank you!`;
      this.dialogService.openDialog(answerTitle, answerText, [0]);
    });
      // TODO: compose message - poetry - API
  }
}
