import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LegalComponent, GDPRComponent, CreditsComponent } from './Extras';
import { HomeComponent, SearchComponent, MenuComponent, MenuBottomComponent, ContactComponent, SearchResultsComponent } from './Main';
import { AlertComponent } from './_directives';
import { PressComponent, JnlGroupComponent, ServicesComponent, SavoirFaireComponent, MarquesComponent, MarqueComponent } from './Std';
import { ProductSearchComponent, ProductComponent } from './Products';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { routing } from './app-routing.module';
import { LoginComponent, RegisterComponent } from './Auth';
import { DataExchangeService, ConfigService, AlertService, AuthenticationService, UserService } from './_services';
import { AuthGuard } from './_guards';
import { BrowserXhr } from '@angular/http';
import { CustExtBrowserXhr, ErrorInterceptor, JwtInterceptor } from './_helpers';


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
    MarqueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    ReactiveFormsModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [
    DataExchangeService,
    ConfigService,
    AlertService,
    AuthGuard,
    AuthenticationService,
    UserService,
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      { provide: BrowserXhr, useClass: CustExtBrowserXhr },
      { provide: LOCALE_ID, useValue: 'en-BE' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
