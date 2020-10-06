import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Select18Component } from './select18.component';

describe('Select18Component', () => {
  let component: Select18Component;
  let fixture: ComponentFixture<Select18Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Select18Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Select18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
