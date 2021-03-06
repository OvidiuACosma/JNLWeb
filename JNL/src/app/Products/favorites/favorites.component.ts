
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, FavoritesService, ProductsService } from '../../_services';
import { IFavorites, IFavoritesProducts, IDialogData, IProductToFavorites,
         IGarnissageDto, IProdGarnissage, Browser } from '../../_models';
import { concatMap, map, mergeMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import * as _ from 'lodash';
import { ProductGarnissageDetailsComponent } from '../product-garnissage-details/product-garnissage-details.component';


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
  sharedFavoritesListLink: string;
  listId = 0;
  removeAll = false;
  browser: Browser;

  productsToFavProd: IProductToFavorites[];
  productsToFavGa: IProductToFavorites[];
  productsToFavFin: IProductToFavorites[];
  productsToFavRts: IProductToFavorites[];
  productsToFav: IProductToFavorites[] = [];

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
              mergeMap(fav => this.dataex.currentBrowser.pipe(
                map(_browser => ({
                    lang: lang,
                    text: text,
                    p: p,
                    user: user,
                    fav: fav,
                    browser: _browser
                  })
                )
              ))
            ))
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.language = resp.lang || 'EN';
      this.text = resp.text[0][this.language.toUpperCase()];
      this.favoritesList = resp.fav;
      this.browser = resp.browser;
      const i = parseInt(resp.p.id, 10) !== 0 ? parseInt(resp.p.id, 10) : resp.fav[0].id;
      this.setFavoriteList(i);
    });
  }

  setFavoriteList(favListId: number) {
    this.sharedFavoritesListLink = null;
    this.listId = favListId;
    this.currentFavoriteList = this.favoritesList.find(f => f.id === favListId);
    this.getProductsOfFavoriteList(favListId);
  }

  getProductsOfFavoriteList(favListId: number) {
    this.favoritesService.getFavoritesProducts(favListId)
    .subscribe(products => {
      const favProd = this.getFavoritesProductsByType(products, 1);
      const favPGa = this.getFavoritesProductsByType(products, 2);
      const favFin = this.getFavoritesProductsByTypeFin(products, 3);
      const favRts = this.getFavoritesProductsByType(products, 4);
      this.getProductsDetails(favProd, favPGa, favFin, favRts);
    });
  }

  getFavoritesProductsByType(products: IFavoritesProducts[], type: number): { brand: string, id: any}[] {
    return _.filter(products, { type: type })
            .map(m => {
              return { brand: m.productBrand,
               id: type === 2 ? m.prodCode : m.productId };
              });
  }

  getFavoritesProductsByTypeFin(products: IFavoritesProducts[], type: number): { brand: string, id: number, id2: number}[] {
    return _.filter(products, { type: type })
            .map(m => {
              return { brand: m.productBrand,
               id: m.productId,
               id2: m.productId2 };
              });
  }

  getProductsDetails(favProd: any[], favPGa: any[], favFin: any[], favRts: any[]) {
    this.favoritesService.getFavoritesProductsProd(favProd, this.language).pipe(
      mergeMap(fProd => this.favoritesService.getFavoritesProductsGa(favPGa, this.language).pipe(
        mergeMap(fGa => this.favoritesService.getFavoritesProductsFin(favFin, this.language).pipe(
         mergeMap(fFin => this.favoritesService.getFavoritesProductsRts(favRts, this.language).pipe(
            map(fRts => ({
              fProd: fProd,
              fGa: fGa,
              fFin: fFin,
              fRts: fRts
            }))
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.productsToFavProd = resp.fProd;
      this.productsToFavGa = resp.fGa;
      this.productsToFavFin = resp.fFin;
      this.productsToFavRts = resp.fRts;
      console.log('Products to RTS:', this.productsToFavRts);
      this.productsToFav = [];
      if (this.productsToFavProd) { this.productsToFav.push(...this.productsToFavProd); }
      if (this.productsToFavRts) { this.productsToFav.push(...this.productsToFavRts); }
      if (this.productsToFavGa) { this.productsToFav.push(...this.productsToFavGa); }
      if (this.productsToFavFin) { this.productsToFav.push(...this.productsToFavFin); }
    });
  }

  getProductImage(product: IProductToFavorites): string {
    switch (product.type) {
      case 1: {
        return `assets/Images/Products/${product.brand}/${product.text}/Search/${product.model}.jpg`;
      }
      case 2: {
        return`assets/Images/Products/Garnissages/${product.prodCode.toUpperCase()}.jpg`;
      }
      case 3: {
        return `assets/Images/Products/${product.brand}/Samples/Print/${product.text}.jpg`;
      }
      case 4: {
        return `assets/Images/Products/Ready To Sell/${product.brand}/${product.text}/Search/${product.id}.jpg`;
      }
    }
    return '';
  }

  getAltText(product: IProductToFavorites): string {
    return `${product.brand} ${product.family} ${product.model}`;
  }

  goToFavoriteList(favListId: number) {
    if (this.listId !== favListId) {
      this.router.navigate([`product/favorites/${favListId}`]);
    }
  }

  goToProduct(product: IProductToFavorites) {
    switch (product.type) {
      case 1: {
        this.router.navigate(['product/product', {b: product.brand, f: product.text, m: product.model}]);
        this.scrollTop();
        break;
      }
      case 2: {
        this.showProductGa(product);
        break;
      }
      case 3: {
        this.showProductFin(product);
        break;
      }
      case 4: {
        this.router.navigate(['product/productStoreItem', {id: product.id}]);
        break;
      }
    }
  }

  showProductGa(product: IProductToFavorites) {
    const ga: IGarnissageDto = { materialFr: product.text, model: product.model };
    this.productsService.getGarnissage(ga).subscribe(resp => {
      if (resp) {
        const garn: IProdGarnissage[] = this.productsService.mapProducts(resp, this.language);
        const dialogConfig = this.productsService.getGarnissageDialogConfig(garn[0], 'ga', this.browser.isDesktopDevice);
        this.openDialogGa(dialogConfig);
      }
    });
  }

  showProductFin(product: IProductToFavorites) {
    const dialogConfig = this.productsService.getGarnissageDialogConfig(product, 'fin', this.browser.isDesktopDevice);
    this.openDialogGa(dialogConfig);
  }

  openDialogGa(dialogConfig: MatDialogConfig<any>) {
    const dialogRef = this.dialog.open(ProductGarnissageDetailsComponent, dialogConfig);
  }

  getProductName(product: IProductToFavorites): string {
    return `${product.family} ${product.model}`;
  }

  remove(product: IProductToFavorites) {
    this.favoritesService.deleteFavoritesProduct(product, this.listId)
    .subscribe(res => {
      this.setFavoriteList(this.listId);
    });
  }

  shareFavoritesList(favList: IFavorites) {
    this.sharedFavoritesListLink = `https://www.jnl.be/product/sharedfavorites/${favList.rowguid}`;
  }

  notify(event: string) {
    const message = `The link ('${event}') has been copied to clipboard.`;
    this.sharedFavoritesListLink = null;
    this.openDialog('Thank you!', message);
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
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
