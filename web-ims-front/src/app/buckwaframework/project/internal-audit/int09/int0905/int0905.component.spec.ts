import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0905Component } from './int0905.component';

describe('Int0905Component', () => {
  let component: Int0905Component;
  let fixture: ComponentFixture<Int0905Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0905Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0905Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
