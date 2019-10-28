import { Component, OnInit } from '@angular/core';
import { DataExchangeService } from 'src/app/_services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

export class ContactComponent implements OnInit {

  language: string;
  type = '2';

  constructor(private route: ActivatedRoute,
              private dataex: DataExchangeService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.params.subscribe(p => {
      if (p.type) {
        this.type = p['type'];
      }
    });
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
    });
  }
}
