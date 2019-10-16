import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, ContactComponent, PageNotFoundComponent } from './Main';
import { AuthGuard } from './_guards';
import { RegisterComponent } from './Auth';
import { ActualiteComponent, JnlGroupComponent, MarquesComponent, PressComponent,
          SavoirFaireComponent, ServicesComponent, MarqueComponent } from './Std';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch : 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'contact', component: ContactComponent },

  { path: 'product', loadChildren: './Products/products.module#ProductsModule' },

  { path: 'actualites', component: ActualiteComponent },
  { path: 'jnlGroup', component: JnlGroupComponent },
  { path: 'marques', component: MarquesComponent },
  { path: 'marque/:marque', component: MarqueComponent },
  { path: 'press', component: PressComponent },
  { path: 'savoirFaire', component: SavoirFaireComponent },
  { path: 'services', component: ServicesComponent },

  { path: 'extras', loadChildren: './Extras/extras.module#ExtrasModule' },

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
  ]
})
export class AppRoutingModule { }
