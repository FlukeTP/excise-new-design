import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int1504Component } from './int1504.component';

describe('Int1504Component', () => {
  let component: Int1504Component;
  let fixture: ComponentFixture<Int1504Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int1504Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int1504Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
