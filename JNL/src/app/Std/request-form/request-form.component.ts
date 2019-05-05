import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestsService, TranslationService, DataExchangeService, ArchiveService } from '../../_services';
import { RequestForm } from '../../_models';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {

  @Input() requestType: number;
  // 1 - Newsletter; 2 - Contact; 3 - Projects; 4 - Product; 5 - Favorites;
  public requestForm: FormGroup;
  language: string;
  text: any;
  countryNames: any;
  activity: any;
  projectType: any; // 0 - title(disabled); 1 - private interior project; 2 - hotel; 3 - showroom; 4 - other;

  constructor(private fb: FormBuilder,
              private requestsService: RequestsService,
              private textService: TranslationService,
              private dataex: DataExchangeService,
              private archiveService: ArchiveService) {
    this.createForm();
  }

  ngOnInit() {
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
      this.getCountries();
    });
    this.rebuildForm();
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
    const requestFormGroup: FormGroup = this.fb.group(requestForm);
    // TODO: populate form fields from user if logged in
    requestFormGroup.get('email').setValidators([Validators.email]);
    requestFormGroup.get('message').setValidators([Validators.required]);
    requestFormGroup.get('name').setValidators([Validators.required]);
    requestFormGroup.get('surname').setValidators([Validators.required]);
    requestFormGroup.updateValueAndValidity();
    return requestFormGroup;
  }

  onSubmit() {
    console.log('Request Form Values: ', JSON.stringify(this.requestForm.value));
    // TODO: custom validate input
    if (this.requestForm.valid) {
      this.requestsService.postRequest(this.requestForm.value)
      .subscribe(s => {
        console.log('Message success.', s);
        this.rebuildForm();
      });
    }
  }

  isFormValid(): boolean {
    return this.requestForm.valid;
  }
}
