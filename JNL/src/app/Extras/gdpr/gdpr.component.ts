import { Component, OnInit } from '@angular/core';
import { DataExchangeService } from 'src/app/_services';

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss']
})
export class GDPRComponent implements OnInit {

  language: string;

  constructor(private dataex: DataExchangeService) { }

  ngOnInit() {
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
    });
  }

}
