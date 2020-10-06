import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int070203Component } from './int070203.component';

describe('Int070203Component', () => {
  let component: Int070203Component;
  let fixture: ComponentFixture<Int070203Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int070203Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int070203Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
