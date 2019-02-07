
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, ArchiveService } from 'src/app/_services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { fillProperties } from '@angular/core/src/util/property';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, AfterViewChecked  {

  language: string;
  text: any;

  selected = [0, 0, 0, 0, 0];
  scroller = true;
  numbers: number[] = [];
  fillers: number[] = [];
  removed: number[] = [];
  removeAll = false;
  total: number;
  nrEmpty = 0;

  country: any;
  countryName: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private dataex: DataExchangeService,
    private textService: TranslationService,
    private countryList: ArchiveService) {
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


    this.getCountries();

  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
  }

  // archive country list
  countryClick() {
    this.scroller = false;
  }

  getCountries() {
    this.countryList.getTextCountries()
    .subscribe(c => {
      const source = c[0];
       this.getCountryList(source);
    });
  }

  getCountryList(source: any) {
    this.countryName = source[this.language.toUpperCase()]['countries'];
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
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element && this.scroller === true ) {
          element.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
        this.scroller = true;
      } else if (this.scroller === true) {
          window.scrollTo(0, 0);
        }
    });
  }

}
