import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0607Component } from './int0607.component';

describe('Int0607Component', () => {
  let component: Int0607Component;
  let fixture: ComponentFixture<Int0607Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0607Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0607Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
