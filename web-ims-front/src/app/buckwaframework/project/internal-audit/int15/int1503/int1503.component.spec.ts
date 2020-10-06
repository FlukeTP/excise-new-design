import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int1503Component } from './int1503.component';

describe('Int1503Component', () => {
  let component: Int1503Component;
  let fixture: ComponentFixture<Int1503Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int1503Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int1503Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
