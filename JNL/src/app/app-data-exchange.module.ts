import { NgModule, ModuleWithProviders } from '@angular/core';
import { DataExchangeService } from './_services';

@NgModule({})
export class DataExchangeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DataExchangeModule,
      providers: [
        DataExchangeService
      ]
    };
  }
}
