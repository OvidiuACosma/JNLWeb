
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, AfterViewChecked {

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

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
