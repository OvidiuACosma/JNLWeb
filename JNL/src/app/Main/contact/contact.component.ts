import { Component, OnInit } from '@angular/core';
import { DataExchangeService } from 'src/app/_services';
import { ActivatedRoute } from '@angular/router';
import { take, map, mergeMap } from 'rxjs/operators';

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
    this.getData();
  }

  getData() {
    this.route.params.pipe(
      mergeMap(p => this.dataex.currentLanguage.pipe(
        map(lang => ({
          p: p,
          lang: lang
        }))
      ))
    )
    .subscribe(resp => {
      this.language = resp.lang || 'EN';
      if (resp.p.type) {
        this.type = resp.p['type'];
      }
    });
  }
}
