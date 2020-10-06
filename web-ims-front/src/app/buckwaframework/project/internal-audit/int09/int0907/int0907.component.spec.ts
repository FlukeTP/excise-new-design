import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0907Component } from './int0907.component';

describe('Int0907Component', () => {
  let component: Int0907Component;
  let fixture: ComponentFixture<Int0907Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0907Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0907Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
