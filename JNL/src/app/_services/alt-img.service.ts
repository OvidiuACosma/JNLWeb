import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AltImgService {

  private urlAssets = 'assets/Data';

  constructor(private http: HttpClient) { }

  public getAltImages(): Observable<any> {
    return this.http.get<any>(`${this.urlAssets}/Main/alt.json`);
  }
}
