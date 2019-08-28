import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExchangeService, AuthenticationService } from './_services';
import { AuthGuard } from './_guards';



@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService
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
