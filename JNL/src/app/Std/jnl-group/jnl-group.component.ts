import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, ArchiveService } from 'src/app/_services';

@Component({
  selector: 'app-jnl-group',
  templateUrl: './jnl-group.component.html',
  styleUrls: ['./jnl-group.component.css']
})
export class JnlGroupComponent implements OnInit, AfterViewChecked {

  language: string;
  text: any;
  scroller = true;
  year: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private archive: ArchiveService) { }

  ngOnInit() {
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });
  }

  getText(lang: string) {
    this.textService.getTextGroupe()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
  }

  // archive images
  yearClick(yr: any) {
    this.year = yr;
    this.scroller = false;
    this.getImages(this.year);
  }

  getImages(year: any) {
    this.archive.getArchiveImages()
    .subscribe(data => {
      const source = data[0];
      this.getImageSource(source);
    });
  }

  getImageSource(source: any) {
    this.archive = source[this.year];
  }

  // end of archive images


  reScroll() {
    this.scroller = true;
    this.ngAfterViewChecked();
  }

  ngAfterViewChecked() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element && this.scroller === true ) {
          element.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
        // this.scroller = true;
      } else if (this.scroller === true) {
          window.scrollTo(0, 0);
        }
    });
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element &&  this.scroller === true) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
    this.scroller = true;
  }
}
