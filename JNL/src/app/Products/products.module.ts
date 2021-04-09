import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { CoreModule } from '../app-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductGarnissagesComponent } from './product-garnissages/product-garnissages.component';
import { ProductGarnissageDetailsComponent } from './product-garnissage-details/product-garnissage-details.component';
import { ProductDimensionsComponent } from './product-dimensions/product-dimensions.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { ProductCataloguesComponent } from './product-catalogues/product-catalogues.component';
import { ProductComponent } from './product/product.component';
import { FavoritesComponent, DialogAnswerComponent } from './favorites/favorites.component';
import { ProductsService, ConfigService, AlertService, TranslationService } from '../_services';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesSelListComponent } from './favorites-sel-list/favorites-sel-list.component';
import { CopyToClipboardDirective } from '../_directives';
import { FavoritesSharedComponent } from './favorites-shared/favorites-shared.component';
import { ProductStoreComponent } from './product-store/product-store.component';
import { ProductStoreItemComponent } from './product-store-item/product-store-item.component';
import { EmailSharingComponent } from './email-sharing/email-sharing.component';
import { ProductSearchDummyComponent } from '.';


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
    ProductGarnissagesComponent,
    ProductGarnissageDetailsComponent,
    ProductDimensionsComponent,
    ProductDescriptionComponent,
    ProductCataloguesComponent,
    ProductComponent,
    FavoritesComponent,
    FavoritesSelListComponent,
    CopyToClipboardDirective,
    DialogAnswerComponent,
    FavoritesSharedComponent,
    ProductStoreComponent,
    ProductStoreItemComponent,
    EmailSharingComponent,
    ProductSearchDummyComponent
  ],
  exports: [
    ProductSearchComponent,
    ProductGarnissagesComponent,
    ProductGarnissageDetailsComponent,
    ProductDimensionsComponent,
    ProductDescriptionComponent,
    ProductCataloguesComponent,
    ProductComponent,
    FavoritesComponent,
    FavoritesSelListComponent,
    DialogAnswerComponent,
    CopyToClipboardDirective,
    ProductStoreComponent,
    ProductStoreItemComponent,
    ProductSearchDummyComponent
  ],
  entryComponents: [
    DialogAnswerComponent,
    FavoritesSelListComponent
  ],
  providers: [
    ProductsService,
    ConfigService,
    AlertService,
    TranslationService
  ]
})

export class ProductsModule { }
