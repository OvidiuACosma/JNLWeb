import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesSelListComponent } from './favorites-sel-list.component';

describe('FavoritesSelListComponent', () => {
  let component: FavoritesSelListComponent;
  let fixture: ComponentFixture<FavoritesSelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesSelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesSelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
