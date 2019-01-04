import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, ContactComponent, SearchResultsComponent } from './Main';
import { AuthGuard } from './_guards';
import { LoginComponent, RegisterComponent } from './Auth';
import { CreditsComponent, GDPRComponent, LegalComponent } from './Extras';
import { ProductSearchComponent, ProductComponent } from './Products';
import { JnlGroupComponent, MarquesComponent, PressComponent, SavoirFaireComponent, ServicesComponent, MarqueComponent } from './Std';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch : 'full' },
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },

  { path: 'contact', component: ContactComponent },
  { path: 'searchResults/:searchText', component: SearchResultsComponent },

  { path: 'products', component: ProductComponent },
  { path: 'productSearch', component: ProductSearchComponent },

  { path: 'jnlGroup', component: JnlGroupComponent },
  { path: 'marques', component: MarquesComponent },
  { path: 'marque/:marque', component: MarqueComponent },
  { path: 'press', component: PressComponent },
  { path: 'savoirFaire', component: SavoirFaireComponent },
  { path: 'services', component: ServicesComponent },

  { path: 'legal', component: LegalComponent },
  { path: 'gdpr', component: GDPRComponent },
  { path: 'credits', component: CreditsComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64]
  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'});
