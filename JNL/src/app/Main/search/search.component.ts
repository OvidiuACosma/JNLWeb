import { Component, OnInit } from '@angular/core';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router } from '@angular/router';
import { query } from '@angular/core/src/render3';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchMode = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goSearchMode() {
    this.searchMode = !this.searchMode;
  }

  doSearch(text: string) {
    console.log('Search for: ', text, 'SearchMode before: ', this.searchMode);
    this.searchMode = !this.searchMode;
    console.log('SearchMode after: ', this.searchMode);
    if (text) {
    this.router.navigate(['/searchResults', text]);
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
