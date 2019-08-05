
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, ArchiveService } from 'src/app/_services';
import { FavoritesService } from 'src/app/_services/favorites.service';
import { IFavorites } from 'src/app/_models/favorites';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, AfterViewChecked  {

  language: string;
  text: any;
  favoritesList: IFavorites[];

  selected = [0, 0, 0, 0, 0];
  scroller = true;
  numbers: number[] = [];
  fillers: number[] = [];
  removed: number[] = [];
  removeAll = false;
  total: number;
  nrEmpty = 0;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private favoritesService: FavoritesService) {
    }

  ngOnInit() {
    this.dataex.currentLanguage
      .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });
    const numberAll = 15;
    this.total = numberAll;
    for (let index = 0; index < numberAll; index++) {
      this.numbers.push(index);
      this.removed[index] = 0;
    }
    this.dataex.currentUser
    .subscribe(user => {
      this.favoritesService.getFavoritesOfRelation(user.userName)
      .subscribe(fav => {
        this.favoritesList = fav;
        console.log('Favorites list:', this.favoritesList);
      });
    });
  }

  removeItem(index: number) {
    this.removed[index] = 1;
    this.scroller = false;
    this.total--;
    // REMOVE FROM DB ?
  }

  removeAllItems() {
    this.removeAll = true;
  }

  getText(lang: string) {
    this.textService.getTextFavorites()
      .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
  }

  NavigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      window.scrollTo(0, 0);
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  selectMarque(nr: number) {
    if (this.selected[nr] === 1) {
      this.selected[nr] = 0;
    } else {
      this.selected[nr] = 1;
    }
    this.scroller = false;
  }

  ngAfterViewChecked() {
    // this.route.fragment.subscribe(fragment => {
    //   if (fragment) {
    //     const element = document.getElementById(fragment);
    //     if (element && this.scroller === true ) {
    //       element.scrollIntoView({block: 'start', behavior: 'smooth'});
    //     }
    //     this.scroller = true;
    //   } else if (this.scroller === true) {
    //       window.scrollTo(0, 0);
    //     }
    // });
  }
}
