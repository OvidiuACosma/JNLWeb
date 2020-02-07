import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStoreItemComponent } from './product-store-item.component';

describe('ProductStoreItemComponent', () => {
  let component: ProductStoreItemComponent;
  let fixture: ComponentFixture<ProductStoreItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductStoreItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStoreItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
