import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { AuthGuard } from '../_guards';
import { ProductComponent } from './product/product.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { ProductGarnissagesComponent } from './product-garnissages/product-garnissages.component';
import { ProductDimensionsComponent } from './product-dimensions/product-dimensions.component';
import { ProductCataloguesComponent } from './product-catalogues/product-catalogues.component';
import { ProductGarnissageDetailsComponent } from './product-garnissage-details/product-garnissage-details.component';
import { FavoritesSharedComponent } from './favorites-shared/favorites-shared.component';


const routes: Routes = [
  { path: '', component: ProductSearchComponent },
  { path: 'favorites/:id', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'sharedfavorites/:id', component: FavoritesSharedComponent },
  // { path: 'favoritesSelList', component: FavoritesSelListComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent },
  { path: 'products', component: ProductSearchComponent },
  { path: 'productSearch', component: ProductSearchComponent },
  { path: 'productDescription', component: ProductDescriptionComponent },
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
