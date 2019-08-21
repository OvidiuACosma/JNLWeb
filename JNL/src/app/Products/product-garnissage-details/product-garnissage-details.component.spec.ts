import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGarnissageDetailsComponent } from './product-garnissage-details.component';

describe('ProductGarnissageDetailsComponent', () => {
  let component: ProductGarnissageDetailsComponent;
  let fixture: ComponentFixture<ProductGarnissageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGarnissageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGarnissageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
