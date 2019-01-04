import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService } from 'src/app/_services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnChanges {

  @Input() toggleNavBar = false;
  isCollapsed = false;

  constructor(private router: Router,
              private dataex: DataExchangeService) { }

  ngOnInit() {
    this.dataex.currentNavBarStatus
    .subscribe(status => {
      this.isCollapsed = !status;
    });
  }

  ngOnChanges() {
    // this.toggleMenuBar();
  }

  toggleMenuBar() {
    this.dataex.setNavBarStatus(this.isCollapsed);
  }

  goProducts() {
    this.router.navigate(['/products']);
    this.toggleMenuBar();
  }

  NavigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      this.ScrollTop();
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
    this.toggleMenuBar();
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }
}
