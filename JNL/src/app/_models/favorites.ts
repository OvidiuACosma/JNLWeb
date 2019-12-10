import { ProductEF } from './product';

export interface IFavorites {
    id: number;
    relation: string;
    creationDate: Date;
    listName: string;
    rowguid: string;
}

export interface IFavoritesProducts {
    id: number;
    favoritesId: number;
    creationDate: Date;
    productBrand: string;
    productId: number;
    type: number;
}
