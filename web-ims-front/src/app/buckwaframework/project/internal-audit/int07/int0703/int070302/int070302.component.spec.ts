import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int070302Component } from './int070302.component';

describe('Int070302Component', () => {
  let component: Int070302Component;
  let fixture: ComponentFixture<Int070302Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int070302Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int070302Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
