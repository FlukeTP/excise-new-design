import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int11050101Component } from './int11050101.component';

describe('Int11050101Component', () => {
  let component: Int11050101Component;
  let fixture: ComponentFixture<Int11050101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int11050101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int11050101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
