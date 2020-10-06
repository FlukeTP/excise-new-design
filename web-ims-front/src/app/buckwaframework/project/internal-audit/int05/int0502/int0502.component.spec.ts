import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0502Component } from './int0502.component';

describe('Int0502Component', () => {
  let component: Int0502Component;
  let fixture: ComponentFixture<Int0502Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0502Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0502Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
