import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int07010101Component } from './int07010101.component';

describe('Int07010101Component', () => {
  let component: Int07010101Component;
  let fixture: ComponentFixture<Int07010101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int07010101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int07010101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
