import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, ContactComponent, PageNotFoundComponent } from './Main';
import { AuthGuard } from './_guards';
import { ActualiteComponent, JnlGroupComponent, MarquesComponent, PressComponent,
          SavoirFaireComponent, ServicesComponent, MarqueComponent } from './Std';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './Auth/register/register.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch : 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'contact/:type', component: ContactComponent },
  { path: 'contact', component: ContactComponent },

  // { path: 'product', loadChildren: './Products/products.module#ProductsModule' },
  { path: 'product', loadChildren: () => import('./Products/products.module').then(m => m.ProductsModule) },
  { path: 'extras', loadChildren: () => import('./Extras/extras.module').then(m => m.ExtrasModule) },

  { path: 'actualites', component: ActualiteComponent },
  { path: 'jnlGroup', component: JnlGroupComponent },
  { path: 'marques', component: MarquesComponent },
  { path: 'marque/:marque', component: MarqueComponent },
  { path: 'press', component: PressComponent },
  { path: 'savoirFaire', component: SavoirFaireComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'resetpassword/:token', component: ForgotPasswordComponent },

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
