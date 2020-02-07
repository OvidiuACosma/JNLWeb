import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProdGarnissage, User } from 'src/app/_models';
import { DataExchangeService } from 'src/app/_services/data-exchange.service';
import { UserService } from 'src/app/_services/user.service';


@Component({
  selector: 'app-product-garnissage-details',
  templateUrl: './product-garnissage-details.component.html',
  styleUrls: ['./product-garnissage-details.component.scss']
})


export class ProductGarnissageDetailsComponent implements OnInit {

  public material: any;
  user: User;

  constructor(public dialogRef: MatDialogRef<ProductGarnissageDetailsComponent>,
              private userService: UserService,
              private dataex: DataExchangeService,
              @Inject(MAT_DIALOG_DATA) public garnData: IProdGarnissage) { }

  ngOnInit() {
  }

  navigate(direction: string) {}

  getUser() {
    this.dataex.currentUser.subscribe( user => {
      this.user = user;
    });
  }

  addToFavorites(garnData: IProdGarnissage) {
    // TODO: close the modal, then follow the add to favList procedure by garnData.id
    this.dialogRef.close();
    if (this.userService.isLoggedIn()) {
      // this.productService.openDialog(garnData, this.user);
    } else {
      this.userService.openLoginDialog().subscribe(answer => {
        if (answer) {
          // this.productService.openDialog(garnData, this.user);
        } else {
          console.log('Not logged in. Can\'t add to favorites');
        }
      });
    }
  }
}
