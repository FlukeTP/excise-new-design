import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int030103Component } from './int030103.component';

describe('Int030103Component', () => {
  let component: Int030103Component;
  let fixture: ComponentFixture<Int030103Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int030103Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int030103Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
