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

  material: any;
  user: User;

  constructor(public dialogRef: MatDialogRef<ProductGarnissageDetailsComponent>,
              private userService: UserService,
              private dataex: DataExchangeService,
              private productService: ProductsService,
              @Inject(MAT_DIALOG_DATA) public garnData: IProdGarnissage) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.dataex.currentUser.subscribe( user => {
      this.user = user;
    });
  }

  navigate(direction: string) {}

  addToFavorites(product: IProdGarnissage) {
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
}
