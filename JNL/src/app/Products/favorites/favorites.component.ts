
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, FavoritesService, ProductsService } from '../../_services';
import { IFavorites, IFavoritesProducts, ProductEF, IDialogData } from '../../_models';
import { concatMap, map, mergeMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-answer',
  templateUrl: 'dialog-answer.html',
  styleUrls: ['./favorites.component.scss']
})
export class DialogAnswerComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {}

  okClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})

export class FavoritesComponent implements OnInit  {

  language: string;
  text: any;
  favoritesList: IFavorites[];
  currentFavoriteList: IFavorites;
  favoritesProducts: IFavoritesProducts[];
  favoritesProductsDetails: ProductEF[];
  sharedFavoritesListLink: string;
  listId = 0;
  removeAll = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private favoritesService: FavoritesService,
              private productsService: ProductsService,
              public dialog: MatDialog) {
    }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataex.currentLanguage.pipe(
      mergeMap(lang => this.textService.getTextFavorites().pipe(
        mergeMap(text => this.route.params.pipe(
          mergeMap(p => (this.dataex.currentUser).pipe(
              concatMap(user => this.favoritesService.getFavoritesOfRelation(user.userName).pipe(
                  map(resp => ({
                    lang: lang,
                    text: text,
                    p: p,
                    user: user,
                    fav: resp
                  })
                )
              ))
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.language = resp.lang || 'EN';
      this.text = resp.text[0][this.language.toUpperCase()];
      this.favoritesList = resp.fav;
      this.listId = parseInt(resp.p.id, 10);
      const i = this.listId !== 0 ? this.listId : resp.fav[0].id;
      this.currentFavoriteList = resp.fav.find(f => f.id === i);
      this.setFavoriteList(i);
    });
  }

  setFavoriteList(favListId: number) {
    this.sharedFavoritesListLink = null;
    this.currentFavoriteList = this.favoritesList.find(f => f.id === favListId);
    this.getProductsOfFavoriteList(favListId);
  }

  getProductsOfFavoriteList(favListId: number) {
    this.favoritesService.getFavoritesProducts(favListId)
    .subscribe(products => {
      this.favoritesProducts = products;
      const prodIds: number[] = [];
      products.forEach(element => {
        prodIds.push(element.productId);
      });
      if (prodIds.length > 0) {
        this.getProductsDetails(prodIds);
      }
    });
  }

  getProductsDetails(ids: number[]) {
    this.productsService.getProductsListFromIds(ids)
    .subscribe(prod => {
      this.favoritesProductsDetails = prod;
    });
  }

  getProductImage(product: IFavoritesProducts): string {
    // TODO: set the img search dir by type (1, 2, 3)
    let prod: ProductEF;
    let src: string;
    switch (product.type) {
      case 1: {
        prod = this.findProductDetails(product.productId);
        src = `assets/Images/Products/${prod.brand}/${prod.familyFr}/Search/${prod.model}.jpg`;
        break;
      }
      case 2: {
        // TODO: getPrdocutDetails
        src = `assets/Images/Products/Garnissages/${product.productId}.jpg`;
        break;
      }
      case 3: {
        // TODO: getPrdocutDetails
        src = ``;
        break;
      }
    }
    return src;
  }

  getAltText(product: IFavoritesProducts): string {
    const prod: ProductEF = this.findProductDetails(product.productId);
    const productAlt = `${prod.brand} ${prod.familyFr} ${prod.model}`;
    return productAlt;
  }

  findProductDetails(id: number): ProductEF {
    const product: ProductEF = this.favoritesProductsDetails.find(f => f.id === id);
    return product;
  }

  goToProduct(product: IFavoritesProducts) {
    const prod = this.findProductDetails(product.productId);
    this.router.navigate(['product/product', {b: prod.brand, f: prod.familyFr, m: prod.model}]);
    this.scrollTop();
  }

  getProductName(product: IFavoritesProducts): string {
    const prod = this.findProductDetails(product.productId);
    let productName: string;
    switch (this.language.toLowerCase()) {
      case 'fr': {
        productName = prod.familyFr;
        break;
      }
      case 'en': {
        productName = prod.familyEn;
        break;
      }
    }
    productName = `${productName} ${prod.model}`;
    return productName;
  }

  remove(f: IFavoritesProducts) {
    this.favoritesService.deleteFavoritesLG(f.id)
    .subscribe(res => {
      console.log(res.productBrand, res.productId, 'removed from favorites.');
      this.setFavoriteList(res.favoritesId);
    });
  }

  shareFavoritesList(favList: IFavorites) {
    this.sharedFavoritesListLink = `https://www.jnl.be/product/sharedfavorites/${favList.rowguid}`;
  }

  notify(event: string) {
    const message = `The link ('${event}') has been copied to clipboard.`;
    this.sharedFavoritesListLink = null;
    // TODO: dialog confirm
    this.openDialog('Thank you!', message);
    // console.log(message);
  }

  openDialog(answerTitle: string, answerText: string): void {
    answerText = `${answerText} Please paste it in the document or the message you wish to share.`;
    const dialogRef = this.dialog.open(DialogAnswerComponent, {
      width: '380px',
      data: {
        title: answerTitle,
        text: answerText
      }
    });

    // in case the dialog provides an answer (like Input box)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.answerText = result;
    });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
