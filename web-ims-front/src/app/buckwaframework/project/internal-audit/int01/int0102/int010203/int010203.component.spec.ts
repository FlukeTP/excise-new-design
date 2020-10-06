import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int010203Component } from './int010203.component';

describe('Int010203Component', () => {
  let component: Int010203Component;
  let fixture: ComponentFixture<Int010203Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int010203Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int010203Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
