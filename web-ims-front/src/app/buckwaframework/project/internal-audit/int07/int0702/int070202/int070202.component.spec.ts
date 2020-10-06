import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int070202Component } from './int070202.component';

describe('Int070202Component', () => {
  let component: Int070202Component;
  let fixture: ComponentFixture<Int070202Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int070202Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int070202Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
