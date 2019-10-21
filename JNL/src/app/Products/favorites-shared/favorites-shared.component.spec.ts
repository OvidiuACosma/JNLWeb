import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesSharedComponent } from './favorites-shared.component';

describe('FavoritesSharedComponent', () => {
  let component: FavoritesSharedComponent;
  let fixture: ComponentFixture<FavoritesSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
