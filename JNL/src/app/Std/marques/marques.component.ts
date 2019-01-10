import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-marques',
  templateUrl: './marques.component.html',
  styleUrls: ['./marques.component.css']
})
export class MarquesComponent implements OnInit, AfterViewChecked {

  public marque: string;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.marque = params['marque'];
    });
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

  navigateToMarque(marque: string) {
    this.router.navigate(['/marque', marque]);
    window.scrollTo(0, 0);
  }
}
