import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCataloguesComponent } from './product-catalogues.component';

describe('ProductCataloguesComponent', () => {
  let component: ProductCataloguesComponent;
  let fixture: ComponentFixture<ProductCataloguesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCataloguesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCataloguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
