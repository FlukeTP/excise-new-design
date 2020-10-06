import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int090301Component } from './int090301.component';

describe('Int090301Component', () => {
  let component: Int090301Component;
  let fixture: ComponentFixture<Int090301Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int090301Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int090301Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
