import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int070103Component } from './int070103.component';

describe('Int070103Component', () => {
  let component: Int070103Component;
  let fixture: ComponentFixture<Int070103Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int070103Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int070103Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
