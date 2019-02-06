import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  private urlAssets = 'assets/Data';

  constructor(private http: HttpClient) { }

  public getArchiveImages(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Std/archive.json`);
  }

  public getTextCountries(): Observable<any> {
    return this.http.get(`${this.urlAssets}/Main/countries.json`);
  }
}
