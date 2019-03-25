import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, ContactComponent, SearchResultsComponent, PageNotFoundComponent } from './Main';
import { AuthGuard } from './_guards';
import { LoginComponent, RegisterComponent } from './Auth';
import { CreditsComponent, GDPRComponent, LegalComponent } from './Extras';
import { ProductSearchComponent, ProductComponent, ProductDescriptionComponent, ProductMatFinComponent,
         ProductDimensionsComponent, ProductCataloguesComponent, FavoritesComponent} from './Products';
import { ActualiteComponent, JnlGroupComponent, MarquesComponent, PressComponent,
  SavoirFaireComponent, ServicesComponent, MarqueComponent } from './Std';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch : 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'contact', component: ContactComponent },
  { path: 'searchResults/:searchText', component: SearchResultsComponent },

  { path: 'favorites', component: FavoritesComponent },
  { path: 'product', component: ProductComponent },
  { path: 'products', component: ProductSearchComponent },
  { path: 'productSearch', component: ProductSearchComponent },
  { path: 'productDescription', component: ProductDescriptionComponent },
  { path: 'productMatFin', component: ProductMatFinComponent },
  { path: 'productDimensions', component: ProductDimensionsComponent },
  { path: 'productCatalogues', component: ProductCataloguesComponent},

  { path: 'actualites', component: ActualiteComponent },
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
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled' /** ,
    scrollOffset: [0, 64] // [x, y]*/
  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'});
