import { Component, Inject, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'JNL';
  toggleNavBar = false;

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  toggleNav() {
    this.toggleNavBar = !this.toggleNavBar;
  }
}
