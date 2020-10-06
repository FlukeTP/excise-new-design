import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int090302Component } from './int090302.component';

describe('Int090302Component', () => {
  let component: Int090302Component;
  let fixture: ComponentFixture<Int090302Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int090302Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int090302Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
