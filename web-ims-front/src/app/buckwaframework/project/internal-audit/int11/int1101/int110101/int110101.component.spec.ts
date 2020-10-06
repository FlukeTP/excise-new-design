import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int110101Component } from './int110101.component';

describe('Int110101Component', () => {
  let component: Int110101Component;
  let fixture: ComponentFixture<Int110101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int110101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int110101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
