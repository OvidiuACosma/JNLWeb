import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, IFavorites, IFavoritesProducts, ProductEF } from 'src/app/_models';
import { FavoritesService } from 'src/app/_services/favorites.service';

@Component({
  selector: 'app-favorites-sel-list',
  templateUrl: './favorites-sel-list.component.html',
  styleUrls: ['./favorites-sel-list.component.css']
})
export class FavoritesSelListComponent implements OnInit {

  product: ProductEF;
  user: User;
  favoritesList: IFavorites[];
  newFavList: string;
  addedToList: string = null;

  constructor(public dialogRef: MatDialogRef<FavoritesSelListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { product: ProductEF, user: User},
              private favoritesService: FavoritesService) { }

  ngOnInit() {
    this.product = this.data.product;
    this.user = this.data.user;
    this.getFavoritesList();
  }

  getFavoritesList() {
    this.favoritesService.getFavoritesOfRelation(this.user.userName)
    .subscribe(favList => {
      this.favoritesList = favList;
    });
  }

  selectFavList(favList: IFavorites) {
    const favProduct: IFavoritesProducts = { id: null,
                                              favoritesId: favList.id,
                                              productBrand: this.product.brand,
                                              productId: this.product.id,
                                              creationDate: null  };
    this.favoritesService.postFavoritesLG(favProduct)
    .subscribe(res => {
      this.addedToList = 'Product added to Favorites List: ' + favList.listName;
    });
  }

  createNewFavList() {
    const favList: IFavorites = { id: null,
                                  relation: this.user.userName,
                                  creationDate: null,
                                  listName: this.newFavList,
                                  rowguid: null };
    this.favoritesService.postFavoritesList(favList)
    .subscribe(res => {
      this.selectFavList(res);
      this.getFavoritesList();
      this.newFavList = null;
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
