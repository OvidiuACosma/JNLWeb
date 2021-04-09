import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchDummyComponent } from './product-search-dummy.component';

describe('ProductsSearchDummyComponent', () => {
  let component: ProductSearchDummyComponent;
  let fixture: ComponentFixture<ProductSearchDummyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSearchDummyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSearchDummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
