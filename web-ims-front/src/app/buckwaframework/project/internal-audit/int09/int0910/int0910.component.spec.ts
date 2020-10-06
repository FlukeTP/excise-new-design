import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0910Component } from './int0910.component';

describe('Int0910Component', () => {
  let component: Int0910Component;
  let fixture: ComponentFixture<Int0910Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0910Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0910Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
