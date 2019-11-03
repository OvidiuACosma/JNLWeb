import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExchangeService, AuthenticationService, DialogService, DownloaderService } from './_services';
import { AuthGuard } from './_guards';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [
    AuthGuard,
    AuthenticationService,
    DownloaderService,
    DialogService
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        DataExchangeService
      ]
    };
  }
}
