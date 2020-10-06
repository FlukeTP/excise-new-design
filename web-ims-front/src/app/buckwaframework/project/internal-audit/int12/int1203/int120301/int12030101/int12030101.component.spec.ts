import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int12030101Component } from './int12030101.component';

describe('Int12030101Component', () => {
  let component: Int12030101Component;
  let fixture: ComponentFixture<Int12030101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int12030101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int12030101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
