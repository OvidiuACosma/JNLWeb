import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  // disable console logs in prod mode
  if (window) {
    window.console.log = () => {};
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
