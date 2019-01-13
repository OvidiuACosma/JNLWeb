import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DataExchangeService } from 'src/app/_services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  language: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService) { }

  ngOnInit() {
    this.language = this.dataex.getLanguage();
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  navigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      this.ScrollTop();
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }

  log(index: number) {
    console.log('Active Slide:', index);
  }
}
