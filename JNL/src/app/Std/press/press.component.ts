import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, DownloaderService, AltImgService } from 'src/app/_services';

@Component({
  selector: 'app-press',
  templateUrl: './press.component.html',
  styleUrls: ['./press.component.css']
})
export class PressComponent implements OnInit, AfterViewInit, AfterViewChecked {

  public section: string;
  language: string;
  text: any;
  scroller = true;
  anchor: number;
  blob: any;
  url: any;

  altIndex = 0;
  page = 'press';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private downloader: DownloaderService,
              private alt: AltImgService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.section = params['section'];
    });

    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });

    this.getAlt(this.page);
  }

  getText(lang: string) {
    this.textService.getTextPresse()
    .subscribe(data => {
      const res = data[0];
      this.getLanguageText(res);
    });
  }

  getLanguageText(res: any) {
    this.text = res[this.language.toUpperCase()];
  }

  getAlt(page: string) {
    this.alt.getAltImages()
    .subscribe(data => {
      const res = data[0];
      this.alt[this.altIndex] = this.getAltText(res);
      console.log('Alt' + this.alt[this.altIndex]);
      this.altIndex++;
    });
  }

  getAltText(res: any) {
    this.alt = res[this.page];
  }

  download(marque: any, type: any) {

    // NOT WORKING FOR IE AND EDGE
    this.downloader.getFile(marque, type).subscribe(data => {
      this.blob = new Blob([data], {
        type: 'application/pdf'
      });
      this.url = window.URL.createObjectURL(this.blob);
      window.open(this.url, '_blank');

    });

    this.scroller = false;
  }

  ngAfterViewInit() {
    this.anchor = 1;
  }

  ngAfterViewChecked() {
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

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element &&  this.scroller === true) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
    this.scroller = true;
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

  closeModal() {
  }
}
