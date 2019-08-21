import { CommonModule } from '@angular/common';
import { ExtrasRoutingModule } from './extras-routing.module';
import { NgModule } from '@angular/core';
import { CoreModule } from '../app-core.module';
import { SharedModule } from '../app-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditsComponent } from './credits/credits.component';
import { LegalComponent } from './legal/legal.component';
import { GDPRComponent } from './gdpr/gdpr.component';


@NgModule({
  imports: [
    CommonModule,
    ExtrasRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CreditsComponent,
    LegalComponent,
    GDPRComponent
  ],
  exports: [
    CreditsComponent,
    LegalComponent,
    GDPRComponent
  ],
  providers: [

  ]
})

export class ExtrasModule { }
