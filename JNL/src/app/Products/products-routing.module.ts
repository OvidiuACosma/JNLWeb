import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { AuthGuard } from '../_guards';
import { ProductComponent } from './product/product.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { ProductMatFinComponent } from './product-mat-fin/product-mat-fin.component';
import { ProductGarnissagesComponent } from './product-garnissages/product-garnissages.component';
import { ProductDimensionsComponent } from './product-dimensions/product-dimensions.component';
import { ProductCataloguesComponent } from './product-catalogues/product-catalogues.component';
import { ProductGarnissageDetailsComponent } from './product-garnissage-details/product-garnissage-details.component';


const routes: Routes = [
  { path: '', component: ProductSearchComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent },
  { path: 'products', component: ProductSearchComponent },
  { path: 'productSearch', component: ProductSearchComponent },
  { path: 'productDescription', component: ProductDescriptionComponent },
  { path: 'productMatFin', component: ProductMatFinComponent },
  { path: 'productDimensions', component: ProductDimensionsComponent },
  { path: 'productCatalogues', component: ProductCataloguesComponent},
  { path: 'productGarnissages', component: ProductGarnissagesComponent},
  { path: 'productGarnissageDetails', component: ProductGarnissageDetailsComponent}
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

export class ProductsRoutingModule { }
