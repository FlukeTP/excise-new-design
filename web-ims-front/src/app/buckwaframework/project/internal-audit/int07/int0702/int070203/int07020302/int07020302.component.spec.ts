import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int07020302Component } from './int07020302.component';

describe('Int07020302Component', () => {
  let component: Int07020302Component;
  let fixture: ComponentFixture<Int07020302Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int07020302Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int07020302Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
