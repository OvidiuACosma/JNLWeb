import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DataExchangeService } from 'src/app/_services';

@Component({
  selector: 'app-left-strip',
  templateUrl: './left-strip.component.html'
})
export class LeftStripComponent implements OnInit {

  @Output() toggleNavBar = new EventEmitter();

  constructor(private dataex: DataExchangeService) { }

  public navBarStatus = true;
  navBarButtonSrc: string;
  navBarButtonText: string;

  ngOnInit() {
    this.dataex.currentNavBarStatus
    .subscribe(status => {
      this.navBarStatus = status;
      this.navBarButtonSrc = '/assets/Images/Menu/menuOpen.png';
      this.navBarButtonText = 'MENU';
    });
  }

  toggleNav() {
    this.toggleNavBar.emit(null);
    this.dataex.setNavBarStatus(!this.navBarStatus);
    switch (this.navBarStatus) {
      case false: {
        this.navBarButtonSrc = '/assets/Images/Menu/menuOpen.png';
        this.navBarButtonText = 'MENU';
        break;
      }
      case true: {
        this.navBarButtonSrc = '/assets/Images/Menu/menuClose.png';
        this.navBarButtonText = 'CLOSE';
        break;
      }
    }
  }
}
