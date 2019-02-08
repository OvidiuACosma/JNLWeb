import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, ArchiveService } from 'src/app/_services';
import * as _ from 'lodash';

@Component({
  selector: 'app-jnl-group',
  templateUrl: './jnl-group.component.html',
  styleUrls: ['./jnl-group.component.css']
})
export class JnlGroupComponent implements OnInit, AfterViewChecked {

  language: string;
  text: any;
  archive: any;
  scroller = true;
  year: any;
  isOpen = false;
  archives = [2011, 2012, 2013, 2014, 2015, 2016];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private archiveService: ArchiveService
              ) {}

  ngOnInit() {
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });
    this.archives = _.sortBy(this.archives).reverse();
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

  unsetScroll() {
    this.scroller = false;
  }

  // archive images
  yearClick(yr: any) {
    this.scroller = false;
    this.isOpen = true;
    this.year = yr;
    this.getImages(yr);
  }

  getImages(year: any) {
    this.archiveService.getArchiveImages()
    .subscribe(pics => {
      const source = pics[0];
      this.getImageSource(source);
    });
  }

  getImageSource(source: any) {
    this.archive = source[this.year];
  }

  modalClose() {
    this.year = 0;
  }

  closeModal() {
    const modal = document.getElementById('archivesModal');
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        document.getElementById('btnClose').click();
      }
    };
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
