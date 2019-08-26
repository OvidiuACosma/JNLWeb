import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { CoreModule } from '../app-core.module';
import { SharedModule } from '../app-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductMatFinComponent } from './product-mat-fin/product-mat-fin.component';
import { ProductGarnissagesComponent } from './product-garnissages/product-garnissages.component';
import { ProductGarnissageDetailsComponent } from './product-garnissage-details/product-garnissage-details.component';
import { ProductDimensionsComponent } from './product-dimensions/product-dimensions.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { ProductCataloguesComponent } from './product-catalogues/product-catalogues.component';
import { ProductComponent } from './product/product.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProductsService, DataExchangeService, ConfigService, AlertService, TranslationService } from '../_services';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { AuthGuard } from '../_guards';
import { DialogAnswerComponent } from '../Std';
import { FavoritesSelListComponent } from './favorites-sel-list/favorites-sel-list.component';


@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    ScrollingModule,
    MatIconModule
  ],
  declarations: [
    ProductSearchComponent,
    ProductMatFinComponent,
    ProductGarnissagesComponent,
    ProductGarnissageDetailsComponent,
    ProductDimensionsComponent,
    ProductDescriptionComponent,
    ProductCataloguesComponent,
    ProductComponent,
    FavoritesComponent,
    FavoritesSelListComponent
  ],
  exports: [
    ProductSearchComponent,
    ProductMatFinComponent,
    ProductGarnissagesComponent,
    ProductGarnissageDetailsComponent,
    ProductDimensionsComponent,
    ProductDescriptionComponent,
    ProductCataloguesComponent,
    ProductComponent,
    FavoritesComponent
  ],
  entryComponents: [
    DialogAnswerComponent
  ],
  providers: [
    ProductsService,
    // DataExchangeService,
    ConfigService,
    AlertService,
    AuthGuard,
    TranslationService
  ]
})

export class ProductsModule { }
