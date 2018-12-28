import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnChanges {

  @Input() menuBarOpen = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.toggleMenuBar();
  }

  toggleMenuBar() {
    this.menuBarOpen = !this.menuBarOpen;
  }
}
