import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule, routing } from './app-routing.module';
import { AppComponent } from './app.component';
import { LegalComponent, GDPRComponent, CreditsComponent } from './Extras';
import { HomeComponent, SearchComponent, MenuComponent, MenuBottomComponent, ContactComponent,
         SearchResultsComponent, PageNotFoundComponent, LeftStripComponent } from './Main';
import { AlertComponent } from './_directives';
import { PressComponent, JnlGroupComponent, ServicesComponent, SavoirFaireComponent, MarquesComponent,
         MarqueComponent, ActualiteComponent } from './Std';
import { ProductSearchComponent, ProductComponent, ProductDescriptionComponent, ProductMatFinComponent,
         ProductDimensionsComponent, ProductCataloguesComponent, FavoritesComponent } from './Products';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { LoginComponent, RegisterComponent } from './Auth';
import { DataExchangeService, ConfigService, AlertService, AuthenticationService, UserService,
         TranslationService, ProductsService, PagerService, ArchiveService, DownloaderService,
         RequestsService} from './_services';
import { AuthGuard } from './_guards';
import { BrowserXhr } from '@angular/http';
import { CustExtBrowserXhr, ErrorInterceptor, JwtInterceptor } from './_helpers';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WINDOW_PROVIDERS } from './_services/window.service';
import { RequestFormComponent, DialogAnswerComponent } from './Std/request-form/request-form.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    LegalComponent,
    GDPRComponent,
    CreditsComponent,
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
    DialogAnswerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    ReactiveFormsModule,
    DeviceDetectorModule.forRoot(),
    CarouselModule.forRoot(),
    ScrollingModule,
    MatIconModule,
    MatDialogModule,
    BrowserAnimationsModule
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
      { provide: BrowserXhr, useClass: CustExtBrowserXhr },
      { provide: LOCALE_ID, useValue: 'en-BE' },
  [ WINDOW_PROVIDERS ]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
