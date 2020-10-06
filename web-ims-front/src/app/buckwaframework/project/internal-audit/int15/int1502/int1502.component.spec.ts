import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int1502Component } from './int1502.component';

describe('Int1502Component', () => {
  let component: Int1502Component;
  let fixture: ComponentFixture<Int1502Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int1502Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int1502Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
