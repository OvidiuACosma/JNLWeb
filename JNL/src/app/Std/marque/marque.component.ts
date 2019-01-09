import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataExchangeService } from 'src/app/_services';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-marque',
  templateUrl: './marque.component.html',
  styleUrls: ['./marque.component.css']
})
export class MarqueComponent implements OnInit {

  public marque: string;

  constructor(private route: ActivatedRoute,
               private router: Router,
              private dataex: DataExchangeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.marque = params['marque'];
    });
  }

  NavigateTo(target: string, fragment: string = '') {
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
}
