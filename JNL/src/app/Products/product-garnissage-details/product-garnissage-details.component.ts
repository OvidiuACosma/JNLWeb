import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProdGarnissage, User, IProductToFavorites } from 'src/app/_models';
import { DataExchangeService } from 'src/app/_services/data-exchange.service';
import { UserService } from 'src/app/_services/user.service';
import { ProductsService } from 'src/app/_services/products.service';


@Component({
  selector: 'app-product-garnissage-details',
  templateUrl: './product-garnissage-details.component.html',
  styleUrls: ['./product-garnissage-details.component.scss']
})


export class ProductGarnissageDetailsComponent implements OnInit {

  user: User;

  constructor(public dialogRef: MatDialogRef<ProductGarnissageDetailsComponent>,
              private userService: UserService,
              private dataex: DataExchangeService,
              private productService: ProductsService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.dataex.currentUser.subscribe( user => {
      this.user = user;
    });
  }

  navigate(direction: string) {}

  getTitle() {
    switch (this.data.type) {
      case 'ga': {
        return `${this.data.dialogData.model}`;
      }
      case 'fin': {
        return `${this.data.dialogData.family} ${this.data.dialogData.model}`;
      }
    }
  }

  getImage(): string {
    switch (this.data.type) {
      case 'ga': {
        return `assets/Images/Products/Garnissages/Print/${this.data.dialogData.codeProd.toUpperCase()}.jpg`;
      }
      case 'fin': {
        return `assets/Images/Products/${this.data.dialogData.brand}/Samples/Print/${this.data.dialogData.text}.jpg`;
      }
    }
  }

  addToFavorites(product: any) {
    let productToFavorites: IProductToFavorites;
    switch (this.data.type) {
      case 'ga': {
        productToFavorites = this.getProdToFavoritesGa(product);
        break;
      }
      case 'fin': {
        productToFavorites = this.getProdToFavoritesFin(product);
        break;
      }
    }
    this.dialogRef.close();
    if (this.userService.isLoggedIn()) {
      this.productService.openDialog(productToFavorites, this.user);
    } else {
      this.userService.openLoginDialog().subscribe(answer => {
        if (answer) {
          this.productService.openDialog(productToFavorites, this.user);
        } else {
          console.log('Not logged in. Can\'t add to favorites');
        }
      });
    }
  }

  getProdToFavoritesGa(product: IProdGarnissage): IProductToFavorites {
    const productToFavorites: IProductToFavorites = {
      brand: product.brand.replace('Ungaro Home', 'Emanuel Ungaro Home'),
      id: 0,
      id2: 0,
      type: 2,
      prodCode: product.codeProd,
      family: product.material,
      model: product.model,
      text: ''
    };
    return productToFavorites;
  }

  getProdToFavoritesFin(product: any): IProductToFavorites {
    const productToFavorites: IProductToFavorites = {
      brand: product.brand,
      id: product.id,
      id2: product.id2,
      type: 3,
      prodCode: '',
      family: product.family,
      model: product.model,
      text: ''
    };
    return productToFavorites;
  }
}
