import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExchangeService, AuthenticationService, DownloaderService } from './_services';
import { AuthGuard } from './_guards/auth.guard';
import { DialogService } from './_services/dialog.service';



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
