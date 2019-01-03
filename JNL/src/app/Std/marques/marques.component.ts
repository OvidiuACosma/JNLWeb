import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-marques',
  templateUrl: './marques.component.html',
  styleUrls: ['./marques.component.css']
})
export class MarquesComponent implements OnInit, AfterViewChecked {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.navigateToAnchor(fragment);
      } else {
          window.scrollTo(0, 0);
        }
    });
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }
}
