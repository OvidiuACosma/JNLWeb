import { Component, OnInit } from '@angular/core';
import { DataExchangeService } from 'src/app/_services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

export class ContactComponent implements OnInit {

  language: string;

  constructor(private dataex: DataExchangeService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
    });
  }
}
