import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService, AlertService,
          ArchiveService, DownloaderService, TranslationService, PagerService,
          RequestsService, UserService } from './_services';
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
          MarqueComponent, ActualiteComponent, RequestFormComponent, DialogAnswerComponent } from './Std';
import { LoginComponent, RegisterComponent } from './Auth';



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
    LoginComponent,
    RegisterComponent,
    SearchResultsComponent,
    MarqueComponent,
    ActualiteComponent,
    PageNotFoundComponent,
    LeftStripComponent,
    RequestFormComponent,
    DialogAnswerComponent,
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
    LoginComponent,
    RegisterComponent,
    SearchResultsComponent,
    MarqueComponent,
    ActualiteComponent,
    PageNotFoundComponent,
    LeftStripComponent,
    RequestFormComponent,
    DialogAnswerComponent,
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
    ConfigService,
    AlertService,

    ArchiveService,
    DownloaderService,
    TranslationService,
    PagerService,
    RequestsService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: BrowserXhr, useClass: CustExtBrowserXhr },
  ]
})
export class CoreModule { }
