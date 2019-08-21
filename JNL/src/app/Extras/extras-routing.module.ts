import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreditsComponent } from './credits/credits.component';
import { LegalComponent } from './legal/legal.component';
import { GDPRComponent } from './gdpr/gdpr.component';


const routes: Routes = [
  { path: '', component: CreditsComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'gdpr', component: GDPRComponent },
  { path: 'credits', component: CreditsComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})

export class ExtrasRoutingModule { }
