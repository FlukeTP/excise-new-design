import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int070101Component } from './int070101.component';

describe('Int070101Component', () => {
  let component: Int070101Component;
  let fixture: ComponentFixture<Int070101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int070101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int070101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
