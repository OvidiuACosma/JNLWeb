import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPriceListDialogData } from 'src/app/_models';

@Component({
  selector: 'app-pricelist-dialog',
  templateUrl: './pricelist-dialog.component.html',
  styleUrls: ['./pricelist-dialog.component.scss']
})

export class PricelistDialogComponent implements OnInit {

  title: string;
  language: string;
  collection: string;
  languages: string[];
  collections: string[];
  labels: string[];

  constructor(
    public dialogRef: MatDialogRef<PricelistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPriceListDialogData) {}

  ngOnInit() {
    this.title = this.data.title;
    this.languages = this.data.languages;
    this.language = this.data.language;
    this.collections = this.data.collections;
    this.collection = this.collections[0];
    this.labels = this.data.labels;
  }

  labelClick(label: string): void {
    const result = {
      action: label,
      language: this.language,
      collection: this.collection
    };
    this.dialogRef.close(result);
  }
}
