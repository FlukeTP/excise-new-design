import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int070102Component } from './int070102.component';

describe('Int070102Component', () => {
  let component: Int070102Component;
  let fixture: ComponentFixture<Int070102Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int070102Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int070102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
