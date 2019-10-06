import { Component, OnInit, AfterViewChecked, AfterViewInit, AfterContentInit, AfterContentChecked } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Scroll } from '@angular/router';
import { DataExchangeService, TranslationService, ArchiveService, AltImgService } from '../../_services';
import * as _ from 'lodash';
declare var $: any; // import jQuery

@Component({
  selector: 'app-jnl-group',
  templateUrl: './jnl-group.component.html',
  styleUrls: ['./jnl-group.component.scss']
})
export class JnlGroupComponent implements OnInit, AfterViewInit, AfterViewChecked {

  language: string;
  text: any;
  people: string[];
  archive: any;
  scroller = true;
  anchor: number;
  year: any;
  isOpen = false;
  archives = [2014, 2015, 2016, 2017, 2018, 2019];

  altText: any;
  page = 'group';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private archiveService: ArchiveService,
              private altService: AltImgService) {}

  ngOnInit() {
    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
      this.getAlt(this.page);
    });
    this.archives = _.sortBy(this.archives).reverse();
    // activate carousel
    $(document).ready(function() {
      $('.carousel').carousel();
    });
  }

  ngAfterViewInit() {
    this.anchor = 1;
  }

  ngAfterViewChecked() {
    // this.anchor <= 2 - ensures it pass the code 2 times, otherwise no scroll to anchor happens
    if (this.anchor <= 2) {
      this.route.fragment.subscribe(fragment => {
        if (fragment) {
          this.navigateToAnchor(fragment);
          this.anchor++;
        } else {
            this.scrollTop();
            this.anchor++;
          }
      });
    }
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
    this.getPeople(this.text);
  }

  getPeople(text: any) {
    this.people = text['people'].sort(function(a, b) {
      return a.index - b.index;
    });
  }


  getAlt(page: string) {
    this.altService.getAltImages()
    .subscribe(data => {
      const res = data[0];
      this.altText = this.getAltText(res, this.page);
    });
  }

  getAltText(res: any, page: string): any {
    return res[page];
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

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  navigateTo(target: string, fragment: string = '') {
    this.anchor = 2;
    if (fragment === '') {
      this.router.navigate([target]);
      this.scrollTop();
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
