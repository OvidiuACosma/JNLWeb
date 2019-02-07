import { Component, OnInit } from '@angular/core';
import { DataExchangeService, TranslationService, ArchiveService } from 'src/app/_services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  scroller = true;

  country: any;
  cy: any;

  constructor(private dataex: DataExchangeService,
              private textService: TranslationService,
              private countryList: ArchiveService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getCountries();
  }

  getCountries() {
    this.countryList.getTextCountries()
    .subscribe(c => {
      const source = c[0];
       this.getCountryList(source);
    });
  }

  getCountryList(source: any) {
    this.cy = source['countries'];
  }

}
