import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int07010102Component } from './int07010102.component';

describe('Int07010102Component', () => {
  let component: Int07010102Component;
  let fixture: ComponentFixture<Int07010102Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int07010102Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int07010102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
