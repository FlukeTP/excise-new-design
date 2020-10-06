import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0909Component } from './int0909.component';

describe('Int0909Component', () => {
  let component: Int0909Component;
  let fixture: ComponentFixture<Int0909Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0909Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0909Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
