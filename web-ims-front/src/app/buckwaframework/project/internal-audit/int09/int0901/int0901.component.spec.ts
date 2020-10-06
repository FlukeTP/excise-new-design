import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0901Component } from './int0901.component';

describe('Int0901Component', () => {
  let component: Int0901Component;
  let fixture: ComponentFixture<Int0901Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0901Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0901Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
