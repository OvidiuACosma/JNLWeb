import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGarnissagesComponent } from './product-garnissages.component';

describe('ProductGarnissagesComponent', () => {
  let component: ProductGarnissagesComponent;
  let fixture: ComponentFixture<ProductGarnissagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGarnissagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGarnissagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
