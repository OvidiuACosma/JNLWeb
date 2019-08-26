import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExchangeService } from './_services';



@NgModule({
  imports: [
    CommonModule
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
