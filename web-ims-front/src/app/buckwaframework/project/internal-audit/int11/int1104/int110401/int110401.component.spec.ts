import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int110401Component } from './int110401.component';

describe('Int110401Component', () => {
  let component: Int110401Component;
  let fixture: ComponentFixture<Int110401Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int110401Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int110401Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
