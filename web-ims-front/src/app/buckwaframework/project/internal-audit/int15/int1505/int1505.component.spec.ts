import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int1505Component } from './int1505.component';

describe('Int1505Component', () => {
  let component: Int1505Component;
  let fixture: ComponentFixture<Int1505Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int1505Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int1505Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
