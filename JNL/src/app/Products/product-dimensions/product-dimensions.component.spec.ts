import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDimensionsComponent } from './product-dimensions.component';

describe('ProductDimensionsComponent', () => {
  let component: ProductDimensionsComponent;
  let fixture: ComponentFixture<ProductDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
