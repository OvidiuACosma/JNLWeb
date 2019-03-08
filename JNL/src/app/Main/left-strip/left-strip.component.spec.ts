import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftStripComponent } from './left-strip.component';

describe('LeftStripComponent', () => {
  let component: LeftStripComponent;
  let fixture: ComponentFixture<LeftStripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftStripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
