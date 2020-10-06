import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int07030201Component } from './int07030201.component';

describe('Int07030201Component', () => {
  let component: Int07030201Component;
  let fixture: ComponentFixture<Int07030201Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int07030201Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int07030201Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
