import { Component, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from './_services/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'JNL';
  scrollTopVisible = false;

  constructor(@Inject(LOCALE_ID) public locale: string,
              @Inject(DOCUMENT) private document: Document,
              @Inject(WINDOW) private window: Window) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    // console.log('Scroll Y offset: ', offset);
   if (offset >= 200) {
     this.scrollTopVisible = true;
     console.log('ScrollTopVis: ', this.scrollTopVisible);
    } else {
      this.scrollTopVisible = false;
    }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
