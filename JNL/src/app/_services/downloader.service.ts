import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {

  private urlAssets = 'assets/Downloads';

  constructor(private http: HttpClient) { }

  public getFile(marque: any, type: any): Observable<Blob> {
    return this.http.get(`${this.urlAssets}/{{marque}}_{{type}}.jpg`, { responseType: 'blob' });
  }
}
