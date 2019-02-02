import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataExchangeService, TranslationService, DownloaderService } from 'src/app/_services';
import { getFirstTemplatePass } from '@angular/core/src/render3/state';
import { GeneratedFile, analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-press',
  templateUrl: './press.component.html',
  styleUrls: ['./press.component.css']
})
export class PressComponent implements OnInit, AfterViewChecked {

  public section: string;

  language: string;
  text: any;

  blob: any;
  url: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataex: DataExchangeService,
              private textService: TranslationService,
              private downloader: DownloaderService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.section = params['section'];
    });

    this.dataex.currentLanguage
    .subscribe(lang => {
      this.language = lang || 'EN';
      this.getText(lang);
    });
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
    // switch (this.language) {
    //     case 'EN': {
    //       this.text = res['EN'];
    //       break;
    //       }
    //     case 'FR': {
    //       this.text = res['FR'];
    //       break;
    //     }
    //     default: {
    //       this.text = res['EN'];
    //       break;
    //     }
    //   }
    //   console.log('Home text:' , this.text);
  }

  download(marque: any, type: any) {

    this.downloader.getFile(marque, type).subscribe(data => {
      this.blob = new Blob([data], {
        type: 'application/pdf'
      });
      this.url = window.URL.createObjectURL(this.blob);
      window.open(this.url);
    });
  }


  ngAfterViewChecked() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.navigateToAnchor(fragment);
      } else {
          window.scrollTo(0, 0);
        }
    });
  }

  navigateToAnchor(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  navigateTo(target: string, fragment: string = '') {
    if (fragment === '') {
      this.router.navigate([target]);
      this.ScrollTop();
    } else {
      this.router.navigate([target], {fragment: fragment});
    }
  }

  ScrollTop() {
    window.scrollTo(0, 0);
  }

}
