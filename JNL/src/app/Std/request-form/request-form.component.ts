import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestsService, TranslationService, DataExchangeService, ArchiveService } from '../../_services';
import { RequestForm, IDialogData } from '../../_models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonDialogComponent } from 'src/app/Main/common-dialog/common-dialog.component';
import { mergeMap, map } from 'rxjs/operators';


@Component({
  selector: 'app-dialog-answer',
  templateUrl: 'dialog-answer.html'
})

export class DialogAnswerComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {}

  okClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit {

  // 1 - Newsletter; 2 - Contact; 3 - Projects; 4 - Product; 5 - Favorites; 6 - Price List Req; 7 - Ready to Sell
  @Input() requestType: number;
  @Input() product: string;
  @Input() favoritesList = 0;
  requestForm: FormGroup;
  language: string;
  text: any;
  countryNames: any;
  activity: any;
  projectType: any; // 0 - title(disabled); 1 - private interior project; 2 - hotel; 3 - showroom; 4 - other;

  constructor(private fb: FormBuilder,
              private requestsService: RequestsService,
              private textService: TranslationService,
              private dataex: DataExchangeService,
              private archiveService: ArchiveService,
              public dialog: MatDialog) {
    this.createForm();
  }

  ngOnInit() {
    this.getData();
    this.rebuildForm();
  }

  getData() {
    this.dataex.currentLanguage.pipe(
      mergeMap(lang => this.textService.getTextRequest().pipe(
        mergeMap(text => this.archiveService.getTextCountries().pipe(
          map(c => ({
            lang: lang,
            text: text,
            c: c
          }))
        ))
      ))
    )
    .subscribe(resp => {
      this.language = resp.lang || 'EN';
      this.text = resp.text[0]['placeHolders'][this.language.toUpperCase()];
      this.activity = resp.text[0]['activity'][this.language.toUpperCase()];
      this.projectType = resp.text[0]['projectType'][this.language.toUpperCase()];
      this.countryNames = resp.c[0][this.language.toUpperCase()]['countries'];
    });
  }

  getText(lang: string) {
    this.textService.getTextRequest()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res['placeHolders'][this.language.toUpperCase()];
    this.activity = res['activity'][this.language.toUpperCase()];
    this.projectType = res['projectType'][this.language.toUpperCase()];
  }

  getCountries() {
    this.archiveService.getTextCountries()
      .subscribe(c => {
        const source = c[0];
        this.getCountryList(source);
      });
  }

  getCountryList(source: any) {
    this.countryNames = source[this.language.toUpperCase()]['countries'];
  }

  createForm() {
    this.requestForm = this.fb.group(new RequestForm());
  }

  rebuildForm() {
    this.requestForm.reset();
    this.requestForm = this.setRequestForm();
  }

  setRequestForm(): FormGroup {
    const requestForm = new RequestForm();
    requestForm.type = this.requestType;
    requestForm.product = this.product;
    requestForm.favId = this.favoritesList;

    // TODO: populate form fields from user if logged in

    const requestFormGroup: FormGroup = this.fb.group(requestForm);
    requestFormGroup.get('email').setValidators([Validators.email]);
    requestFormGroup.get('message').setValidators([Validators.required]);
    requestFormGroup.get('name').setValidators([Validators.required]);
    requestFormGroup.get('surname').setValidators([Validators.required]);
    requestFormGroup.updateValueAndValidity();
    return requestFormGroup;
  }

  onSubmit() {
    if (this.requestForm.valid) {
      this.requestsService.postRequest(this.requestForm.value)
      .subscribe(s => {
        const answerTitle = 'Request Saved';
        const answerText = `Your request has been registered.\n
                      Our Customer Service Team will consider it and return to you
                      with an answer in short time.\n\n
                      Thank you!`;
        this.openDialog(answerTitle, answerText);
        this.rebuildForm();
      });
    }
  }

  openDialog(answerTitle: string, answerText: string): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '375px',
      data: {
        title: answerTitle,
        text: answerText,
        buttons: [0]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      return;
    });
  }

  isFormValid(): boolean {
    return this.requestForm.valid;
  }
}
