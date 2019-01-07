import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMatFinComponent } from './product-mat-fin.component';

describe('ProductMatFinComponent', () => {
  let component: ProductMatFinComponent;
  let fixture: ComponentFixture<ProductMatFinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMatFinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMatFinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
