import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExchangeService, ConfigService, AlertService, AuthenticationService,
          ArchiveService, DownloaderService, TranslationService, ProductsService, PagerService,
          RequestsService, UserService } from './_services';
import { AuthGuard } from './_guards';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent, SearchComponent, MenuComponent, MenuBottomComponent, ContactComponent,
          SearchResultsComponent, PageNotFoundComponent, LeftStripComponent } from './Main';
import { AlertComponent } from './_directives';
import { PressComponent, JnlGroupComponent, ServicesComponent, SavoirFaireComponent, MarquesComponent,
          MarqueComponent, ActualiteComponent } from './Std';
import { ProductSearchComponent, ProductComponent, ProductDescriptionComponent, ProductMatFinComponent,
          ProductDimensionsComponent, ProductCataloguesComponent, FavoritesComponent } from './Products';
import { LoginComponent, RegisterComponent } from './Auth';
import { RequestFormComponent, DialogAnswerComponent } from './Std/request-form/request-form.component';
import { ProductGarnissagesComponent } from './Products/product-garnissages/product-garnissages.component';



@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent,
    MenuComponent,
    MenuBottomComponent,
    AlertComponent,
    ContactComponent,
    PressComponent,
    JnlGroupComponent,
    ServicesComponent,
    SavoirFaireComponent,
    MarquesComponent,
    ProductSearchComponent,
    ProductComponent,
    LoginComponent,
    RegisterComponent,
    SearchResultsComponent,
    MarqueComponent,
    ProductDescriptionComponent,
    ProductMatFinComponent,
    ProductDimensionsComponent,
    ProductCataloguesComponent,
    ActualiteComponent,
    PageNotFoundComponent,
    FavoritesComponent,
    LeftStripComponent,
    RequestFormComponent,
    DialogAnswerComponent,
    ProductGarnissagesComponent
  ],
  exports: [
    HomeComponent,
    SearchComponent,
    MenuComponent,
    MenuBottomComponent,
    AlertComponent,
    ContactComponent,
    PressComponent,
    JnlGroupComponent,
    ServicesComponent,
    SavoirFaireComponent,
    MarquesComponent,
    ProductSearchComponent,
    ProductComponent,
    LoginComponent,
    RegisterComponent,
    SearchResultsComponent,
    MarqueComponent,
    ProductDescriptionComponent,
    ProductMatFinComponent,
    ProductDimensionsComponent,
    ProductCataloguesComponent,
    ActualiteComponent,
    PageNotFoundComponent,
    FavoritesComponent,
    LeftStripComponent,
    RequestFormComponent,
    DialogAnswerComponent,
    ProductGarnissagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeviceDetectorModule.forRoot(),
    OverlayModule,
    ScrollingModule,
    MatIconModule,
    MatDialogModule
  ],
  entryComponents: [
    DialogAnswerComponent
  ],
  providers: [
    DataExchangeService,
    ConfigService,
    AlertService,
    AuthGuard,
    AuthenticationService,
    ArchiveService,
    DownloaderService,
    TranslationService,
    ProductsService,
    PagerService,
    RequestsService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: BrowserXhr, useClass: CustExtBrowserXhr },
  ]
})
export class CoreModule { }
