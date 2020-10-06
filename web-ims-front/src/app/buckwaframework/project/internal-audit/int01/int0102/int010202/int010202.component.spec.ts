import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int010202Component } from './int010202.component';

describe('Int010202Component', () => {
  let component: Int010202Component;
  let fixture: ComponentFixture<Int010202Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int010202Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int010202Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
