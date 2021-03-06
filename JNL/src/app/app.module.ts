import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
// import { BrowserXhr } from '@angular/http';
import { WINDOW_PROVIDERS } from './_services/window.service';
import { SharedModule } from './app-shared.module';
import { CoreModule } from './app-core.module';
import { ExtrasModule } from './Extras/extras.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsModule } from './Products/products.module';
import { Angulartics2Module } from 'angulartics2';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule.forRoot(),
    CoreModule,
    BrowserAnimationsModule,
    ExtrasModule,
    ProductsModule,
    Angulartics2Module.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-BE' },
    [ WINDOW_PROVIDERS ]
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
