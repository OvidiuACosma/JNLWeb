import { Component, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from './_services';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  title = 'JNL';
  scrollTopVisible = false;

  constructor(@Inject(LOCALE_ID) public locale: string,
              @Inject(DOCUMENT) private document: Document,
              @Inject(WINDOW) private window: Window,
              angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    angulartics2GoogleAnalytics.startTracking();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    offset >= 200 ? this.scrollTopVisible = true : this.scrollTopVisible = false;
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
