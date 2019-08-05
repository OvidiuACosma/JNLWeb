import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '.';
import { IFavorites } from '../_models/favorites';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private headers: HttpHeaders;
  private apiUrl: string;

  constructor(private http: HttpClient,
      private configService: ConfigService) {
      this.headers = new HttpHeaders({'Content-type': 'application/json; charset=utf-8'});
      this.apiUrl = configService.getApiURI() + '/favorites';
    }

    public getFavorites(): Observable<IFavorites[]> {
      return this.http.get<IFavorites[]>(`${this.apiUrl}`, {headers: this.headers});
    }

    public getFavoritesOfRelation(relation: string): Observable<IFavorites[]> {
      return this.http.get<IFavorites[]>(`${this.apiUrl}/${relation}`, {headers: this.headers});
    }
}
