import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int110501Component } from './int110501.component';

describe('Int110501Component', () => {
  let component: Int110501Component;
  let fixture: ComponentFixture<Int110501Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int110501Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int110501Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
