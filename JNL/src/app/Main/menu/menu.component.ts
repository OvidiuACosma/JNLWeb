import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnChanges {

  @Input() toggleNavBar = false;
  isCollapsed = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.toggleMenuBar();
  }

  toggleMenuBar() {
    this.isCollapsed = !this.isCollapsed;
  }

  goProducts() {
    this.router.navigate(['/products']);
    this.toggleMenuBar();
  }
}
