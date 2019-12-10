import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, IFavorites, IFavoritesProducts, ProductEF } from 'src/app/_models';
import { FavoritesService } from 'src/app/_services/favorites.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites-sel-list',
  templateUrl: './favorites-sel-list.component.html',
  styleUrls: ['./favorites-sel-list.component.scss']
})

export class FavoritesSelListComponent implements OnInit {

  product: ProductEF;
  user: User;
  favoritesList: IFavorites[];
  newFavList: string;
  addedToList: string = null;
  favListForm: FormGroup;
  lockActions = false;

  constructor(public dialogRef: MatDialogRef<FavoritesSelListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { product: ProductEF, user: User},
              private favoritesService: FavoritesService,
              private fb: FormBuilder,
              private router: Router) {
    this.createForm();
  }

  ngOnInit() {
    this.product = this.data.product;
    this.user = this.data.user;
    // this.getFavoritesList();
    this.rebuildForm();
  }

  createForm() {
    this.favListForm = this.fb.group({
      favListArray: this.fb.array([])
    });
  }

  rebuildForm() {
    this.favListForm.reset();
    this.getFavoritesList();
  }

  getFavoritesList() {
    this.favoritesService.getFavoritesOfRelation(this.user.userName)
    .subscribe(favList => {
      this.favoritesList = favList;
      this.setFavListArray(favList);
    });
  }

  setFavListArray(favList: IFavorites[]) {
    // favList.sort(function(a, b) {
    //   return a.listName - b.listName;
    // });
    const favListsFGs: Array<any> = [];
    favList.forEach(element => {
      const obj = {
        listName: element.listName,
        id: element.id,
        editMode: false,
        deleteMode: false
      };
      favListsFGs.push(obj);
    });
    const favListsFGsSorted = favListsFGs;
    const favoritesListsFGs = favListsFGsSorted.map(p => this.fb.group(p));
    const favoritesListsFormArray = this.fb.array(favoritesListsFGs);
    this.favListForm.setControl('favListArray', favoritesListsFormArray);
  }

  get favListArray(): FormArray {
    return this.favListForm.get('favListArray') as FormArray;
  }

  selectFavList(favList: IFavorites) {
    const favProduct: IFavoritesProducts = { id: null,
                                              favoritesId: favList.id,
                                              productBrand: this.product.brand,
                                              productId: this.product.id,
                                              creationDate: null,
                                              type: null };
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

  editFavList(i: number) {
    this.favListArray.at(i).get('editMode').setValue(true);
    this.lockActions = true;
  }

  cancelEditFavList(i: number) {
    this.favListArray.at(i).get('editMode').setValue(false);
    this.lockActions = false;
  }

  saveFavList(i: number) {
    const fList = { id: this.favListArray.at(i).get('id').value,
        listName: this.favListArray.at(i).get('listName').value
      };
    this.favoritesService.patchFavoritesList(fList)
    .subscribe(res => {
      this.rebuildForm();
      this.lockActions = false;
    });
  }

  viewFavList(i: number) {
    const favId: number = this.favListArray.at(i).get('id').value;
    this.navigateTo(`product/favorites/${favId}`);
  }

  tryDeleteFavList(i: number) {
    this.favListArray.at(i).get('deleteMode').setValue(true);
    this.lockActions = true;
  }

  cancelDeleteFavList(i: number) {
    this.favListArray.at(i).get('deleteMode').setValue(false);
    this.lockActions = false;
  }

  deleteFavList(i: number) {
    const id = this.favListArray.at(i).get('id').value;
    this.favoritesService.deleteFavoritesList(id)
    .subscribe(fav => {
      this.rebuildForm();
      this.lockActions = false;
    });
  }

  navigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      window.scrollTo(0, 0);
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
    this.close();
  }

  simulateSubmit() {
    document.getElementById('submitButton').click();
  }

  close(): void {
    this.dialogRef.close();
  }
}
