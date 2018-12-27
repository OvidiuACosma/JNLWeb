import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnlGroupComponent } from './jnl-group.component';

describe('JnlGroupComponent', () => {
  let component: JnlGroupComponent;
  let fixture: ComponentFixture<JnlGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnlGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnlGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
