import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  navigateTo(target: string) {
    this.router.navigate([target]);
    this.ScrollTop();
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }

  setActiveSlide(index: number) {
    console.log('Active Slide:', index);
  }
}
