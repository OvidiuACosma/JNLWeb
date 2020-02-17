import { Component, OnInit, Input } from '@angular/core';
import { DataExchangeService, TranslationService, ProductsService, UserService } from '../../_services';
import * as _ from 'lodash';
import { Product, User, IProductToFavorites, IProductDescription, Finissage } from '../../_models';
import { mergeMap, concatMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss']
})
export class ProductDescriptionComponent implements OnInit {

  @Input() product: Product;
  brand: string;
  productDesc: IProductDescription[];
  description: string;
  parts = new Set();
  materials: string[] = [];
  showLevel = null;
  finissage: Finissage;
  toggle = false;
  language: string;
  stdText: any;
  user: User;

  // data used in modal
  currentFinList: Finissage[] = [];
  index: number;


  constructor(private dataex: DataExchangeService,
              private textService: TranslationService,
              private productsService: ProductsService,
              private userService: UserService) { }

  ngOnInit() {
    this.brand = this.product.brand === 'Vanhamme' ? 'JNL Collection' : this.product.brand;
    this.getData();
  }

  getData() {
    this.productsService.getProductDesc(this.product).pipe(
      mergeMap(prodDesc => this.dataex.currentLanguage.pipe(
        concatMap(lang => this.textService.getTextProductStandard().pipe(
          mergeMap(text => this.dataex.currentUser.pipe(
            map(user => ({
              prodDesc: prodDesc,
              lang: lang,
              text: text,
              user: user
            }))
          ))
        ))
      ))
    )
    .subscribe(resp => {
      this.productDesc = resp.prodDesc;
      this.language = resp.lang || 'EN';
      this.stdText = resp.text[0][this.language.toUpperCase()];
      this.user = resp.user;
      this.getDescription();
      this.getParts();
    });
  }

  getDescription() {
    this.description = this.language === 'FR' ? this.productDesc[0].descriptionFr : this.productDesc[0].descriptionEn;
  }

  getParts() {
    switch (this.language.toLowerCase()) {
      case 'fr': {
        this.parts = new Set(this.productDesc.filter(f => f.partNameFr !== null).map(m => m.partNameFr));
        break;
      }
      case 'en': {
        this.parts = new Set(this.productDesc.filter(f => f.partNameEn !== null).map(m => m.partNameEn));
        break;
      }
    }
  }

  getMaterials(part: string) {
    let matList = new Set();
    switch (this.language.toLowerCase()) {
      case 'fr': {
        matList = new Set(this.productDesc.filter(f => f.partNameFr === part)
          .map(m => m.materialNameFr));
        break;
      }
      case 'en': {
        matList = new Set(this.productDesc.filter(f => f.partNameEn === part)
          .map(m => m.materialNameEn));
        break;
      }
    }
    return matList;
  }

  getFinitions(part: string, material: string) {
    const finList: Finissage[] = [];
    this.productDesc.forEach(item => {
      if (item.finisageNameFr) {
        switch (this.language.toLowerCase()) {
          case 'fr': {
            if (item.partNameFr === part && item.materialNameFr === material) {
              finList.push({
                brand: item.brand,
                id: item.finId,
                materialId: item.matId,
                name: item.finisageNameFr,
                material: item.materialNameFr,
                img: `${item.materialNameFr.replace('/', '-')} ${item.finisageNameFr.replace('/', '-')}.jpg`
              });
            }
            break;
          }
          case 'en': {
            if (item.partNameEn === part && item.materialNameEn === material) {
              finList.push({
                brand: item.brand,
                id: item.finId,
                materialId: item.matId,
                name: item.finisageNameEn,
                material: item.materialNameEn,
                img: `${item.materialNameFr.replace('/', '-')} ${item.finisageNameFr.replace('/', '-')}.jpg`
              });
            }
          }
        }
      }
    });
    return _.sortBy(_.uniq(finList), ['name'], ['asc']);
  }

  toggleFin(index: string) {
    if (this.isLevelShown(index)) {
      this.showLevel = null;
    } else {
      this.showLevel = index;
    }
  }

  isLevelShown(idx: string) {
    return this.showLevel === idx;
  }

  hasFinitions(part: any, mat: any) {
    const finitions: Finissage[] = this.getFinitions(part, mat);
    if (finitions.length > 0) {
      if (!(finitions.length === 1 && ((finitions[0].name.toLowerCase() === 'to define') ||
       (finitions[0].name.toLowerCase() === 'a définir')))) {
        return true;
      }
    }
    return false;
  }

  getUser() {
    this.dataex.currentUser.subscribe( user => {
      this.user = user;
    });
  }

  sendItemToModal(fin: Finissage, finlist: Finissage[]) {
    this.currentFinList = finlist;
    this.finissage = fin;
  }

  navigate(direction: string) {
    this.index = this.currentFinList.findIndex(i => i.name === this.finissage.name);
    if (direction === 'previous') {
      // this.index = (this.index - 1) % this.currentMatList.length;
      this.index--;
      if (this.index === -1) {
        this.index = this.currentFinList.length - 1;
      }
    } else if (direction === 'next') {
      this.index = (this.index + 1) % this.currentFinList.length;
    }
    this.finissage = this.currentFinList[this.index];
  }

  closeModal() {
    const modal = document.getElementById('finissageModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        document.getElementById('btnClose').click();
      }
    };
  }

  // for mobile
  toggleElement() {
    this.toggle = !this.toggle;
  }

  addToFavorites(product: Finissage) {
    document.getElementById('btnClose').click();
    const productToFavorites: IProductToFavorites = {
      brand: product.brand,
      id: product.id,
      id2: product.materialId,
      type: 3,
      prodCode: null,
      family: product.material,
      model: product.name,
      text: ''
    };
    if (this.userService.isLoggedIn()) {
      this.productsService.openDialog(productToFavorites, this.user);
    } else {
      this.userService.openLoginDialog().subscribe(answer => {
        if (answer) {
          this.productsService.openDialog(productToFavorites, this.user);
        } else {
          console.log('Not logged in. Can\'t add to favorites');
        }
      });
    }
  }
}

