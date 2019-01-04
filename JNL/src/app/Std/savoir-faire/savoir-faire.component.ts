import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-savoir-faire',
  templateUrl: './savoir-faire.component.html',
  styleUrls: ['./savoir-faire.component.css']
})
export class SavoirFaireComponent implements OnInit, AfterViewChecked {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {}

  ngAfterViewChecked() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
      } else {
          window.scrollTo(0, 0);
        }
    });
  }

}
