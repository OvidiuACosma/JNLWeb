import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, ContactComponent, SearchResultsComponent, PageNotFoundComponent } from './Main';
import { AuthGuard } from './_guards';
import { LoginComponent, RegisterComponent } from './Auth';
import { ProductSearchComponent, ProductComponent, ProductDescriptionComponent, ProductMatFinComponent,
          ProductDimensionsComponent, ProductCataloguesComponent, FavoritesComponent} from './Products';
import { ActualiteComponent, JnlGroupComponent, MarquesComponent, PressComponent,
          SavoirFaireComponent, ServicesComponent, MarqueComponent } from './Std';
import { ProductGarnissagesComponent } from './Products/product-garnissages/product-garnissages.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch : 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'contact', component: ContactComponent },
  { path: 'searchResults/:searchText', component: SearchResultsComponent },

  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent },
  { path: 'products', component: ProductSearchComponent },
  { path: 'productSearch', component: ProductSearchComponent },
  { path: 'productDescription', component: ProductDescriptionComponent },
  { path: 'productMatFin', component: ProductMatFinComponent },
  { path: 'productDimensions', component: ProductDimensionsComponent },
  { path: 'productCatalogues', component: ProductCataloguesComponent},
  { path: 'productGarnissages', component: ProductGarnissagesComponent},

  { path: 'actualites', component: ActualiteComponent },
  { path: 'jnlGroup', component: JnlGroupComponent },
  { path: 'marques', component: MarquesComponent },
  { path: 'marque/:marque', component: MarqueComponent },
  { path: 'press', component: PressComponent },
  { path: 'savoirFaire', component: SavoirFaireComponent },
  { path: 'services', component: ServicesComponent },

  { path: 'credits', loadChildren: './Extras/extras.module#ExtrasModule' },
  { path: 'legal', loadChildren: './Extras/extras.module#ExtrasModule' },
  { path: 'gdpr', loadChildren: './Extras/extras.module#ExtrasModule' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload'
    /** ,
    scrollOffset: [0, 64] // [x, y]*/
  })
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }

// export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'});
