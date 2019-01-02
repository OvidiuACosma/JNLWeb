import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataExchangeService } from 'src/app/_services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() toggleNavBar = new EventEmitter();

  public searchMode = false;
  public navBarStatus = true;

  constructor(private router: Router,
              private dataex: DataExchangeService) { }

  ngOnInit() {
    this.dataex.currentNavBarStatus
    .subscribe(status => this.navBarStatus = status);
  }

  goSearchMode() {
    this.searchMode = !this.searchMode;
  }

  doSearch(text: string) {
    this.searchMode = !this.searchMode;
    if (text) {
    this.router.navigate(['/searchResults', text]);
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  toggleNav() {
    this.toggleNavBar.emit(null);
    this.dataex.setNavBarStatus(!this.navBarStatus);
  }

  getNavbarButton() {
    switch (this.navBarStatus) {
      case false: {
        return '&#9776;';
      }
      case true: {
        return '&#10005;';
      }
    }
  }
}
