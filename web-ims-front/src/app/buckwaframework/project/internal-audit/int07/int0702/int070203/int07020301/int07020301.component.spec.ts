import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int07020301Component } from './int07020301.component';

describe('Int07020301Component', () => {
  let component: Int07020301Component;
  let fixture: ComponentFixture<Int07020301Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int07020301Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int07020301Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
