import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { IFavorites, IFavoritesProducts } from '../_models/favorites';
import { Observable } from 'rxjs';
import { IProductToFavorites } from '../_models';

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

    public getFavoritesProducts(favListId: number): Observable<IFavoritesProducts[]> {
      return this.http.get<IFavoritesProducts[]>(`${this.apiUrl}/LG/${favListId}`, {headers: this.headers});
    }

    public getFavoritesShared(favListGuid: string): Observable<IFavorites> {
      return this.http.get<IFavorites>(`${this.apiUrl}/shared/${favListGuid}`, {headers: this.headers});
    }

    public getFavoritesProductsProd(products: any[], lang: string): Observable<IProductToFavorites[]> {
      return this.http.post<IProductToFavorites[]>(`${this.apiUrl}/favProd/${lang}`, products, {headers: this.headers});
    }

    public getFavoritesProductsGa(products: any[], lang: string): Observable<IProductToFavorites[]> {
      return this.http.post<IProductToFavorites[]>(`${this.apiUrl}/favGa/${lang}`, products, {headers: this.headers});
    }

    public getFavoritesProductsFin(products: any[], lang: string): Observable<IProductToFavorites[]> {
      return this.http.post<IProductToFavorites[]>(`${this.apiUrl}/favFin/${lang}`, products, {headers: this.headers});
    }


    public postFavoritesList(favList: IFavorites): Observable<IFavorites> {
      return this.http.post<IFavorites>(`${this.apiUrl}`, favList, {headers: this.headers});
    }

    public postFavoritesLG(favProduct: IFavoritesProducts): Observable<IFavoritesProducts> {
      return this.http.post<IFavoritesProducts>(`${this.apiUrl}/LG`, favProduct, {headers: this.headers});
    }

    public patchFavoritesList(favList: any): Observable<IFavorites> {
      // console.log('PATCH:', `${this.apiUrl}/patch/${favList.id}`, JSON.stringify(favList));
      return this.http.patch<IFavorites>(`${this.apiUrl}/patch/${favList.id}`, favList, {headers: this.headers});
    }

    public deleteFavoritesList(favListId: number): Observable<IFavorites> {
      return this.http.delete<IFavorites>(`${this.apiUrl}/delete/${favListId}`, {headers: this.headers});
    }

    public deleteFavoritesLG(favId: number): Observable<IFavoritesProducts> {
      return this.http.delete<IFavoritesProducts>(`${this.apiUrl}/LG/delete/${favId}`, {headers: this.headers});
    }
}
