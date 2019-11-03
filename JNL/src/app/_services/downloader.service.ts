import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGuard } from '../_guards/auth.guard';
import { DataExchangeService } from './data-exchange.service';
import { PricelistDialogComponent } from '../Main/pricelist-dialog/pricelist-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from './dialog.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {

  private urlAssets = 'assets/Downloads';
  private headers: HttpHeaders;
  private apiUrl: string;
  blob: Blob;
  url: string;

  constructor(private http: HttpClient,
              private authGuard: AuthGuard,
              private dataex: DataExchangeService,
              private dialogService: DialogService,
              public dialog: MatDialog,
              private configService: ConfigService) {
    this.apiUrl = configService.getApiURI() + '/Requests/PriceList';
    this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
  }

  public getFile(marque: any, type: any): Observable<Blob> {
    return this.http.get(`${this.urlAssets}/` + marque + `_` + type + `.pdf`, { responseType: 'blob' });
  }

  public getPriceList(language: string, collection: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${collection}/${language}`, { responseType: 'blob', headers: this.headers });
  }

  public priceListRequest(language: string, marque: string = 'all') {
    if (this.isLoggedIn()) {
      this.dataex.currentUser.subscribe( user => {
        if (['A', 'C', 'R'].includes(user.type)) {
          const languages: string[] = this.getLanguagesPL(user.type);
          const collections: string[] = this.getCollectionsPL(marque);
          this.openPriceListDialog(languages, collections, language);
        } else {
          const message = 'Price List access is restricted to registered clients only.\n' +
                          'If you are interested for the pricelist, please fill out the request form ' +
                          'by following the link \'Contact\' below.\nOur Customer Service Team will ' +
                          'consider it and return to you with details.\n\n' +
                          'Thank you!';
          this.dialogService.openDialog('Price List Request', message, [3, 1]);
        }
      });

    } else {
      const message = 'Price List access is restricted to registered clients only.\n' +
                      'Please Login first.\n' +
                      'If you are not registered, you can fill out the request form ' +
                      'by following the link \'Contact\' below.\nOur Customer Service Team will ' +
                      'consider it and return to you with details.\n\n' +
                      'Thank you!';
      this.dialogService.openDialog('Price List Request', message, [2, 3, 1]);
    }
  }

  isLoggedIn(): boolean {
    return this.authGuard.isLoggedIn();
  }

  getLanguagesPL(type: string): string[] {
    let lang: string[];
    switch (type) {
      case 'R': {
        lang = ['RU'];
        break;
      }
      case 'C': {
        lang = ['EN', 'FR'];
        break;
      }
      case 'A': {
        lang = ['EN', 'FR', 'RU'];
        break;
      }
      default:
        lang = [''];
    }
    return lang;
  }

  getCollectionsPL(marque: string): string[] {
    let colls: string[];
    switch (marque) {
      case 'all': {
        colls = ['JNL', 'Vanhamme', 'Ungaro Home', 'JNL Studio'];
        break;
      }
      default: {
        colls = [marque];
        break;
      }
    }
    return colls;
  }

  openPriceListDialog(languages: string[], collections: string[], language: string): void {
    const dialogRef = this.dialog.open(PricelistDialogComponent, {
      width: '400px',
      data: {
        title: 'Price List',
        language: language,
        languages: languages,
        collections: collections,
        labels: ['Download']
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'Download') {
        this.downloadPdf(result.language, result.collection);
      }
    });
  }

  downloadPdf(language: string, collection: string) {
  this.getPriceList(language, collection).subscribe(data => {
      this.blob = new Blob([data], {
        type: 'application/pdf'
      });
      let fileName = collection.toUpperCase() + ' ' + 'Public Price List';
      if (collection.toLowerCase() !== 'jnl studio') {
        fileName += ' ' + language.toUpperCase();
      }
      fileName += '.pdf';
    //    FileSaver.saveAs(this.blob, fileName);
    // });
      this.url = window.URL.createObjectURL(this.blob);

      const fileLink = document.createElement('a');
      fileLink.href = this.url;
      fileLink.download = fileName;
      // fileLink.target = '_blank';
      // fileLink.rel = 'noreferrer';
      fileLink.setAttribute('visibility', 'hidden');
      fileLink.click();

      // window.open(this.url); // OK

      // window.open(this.url, '_blank'); // blocked by AdBlock
    });
  }
}
