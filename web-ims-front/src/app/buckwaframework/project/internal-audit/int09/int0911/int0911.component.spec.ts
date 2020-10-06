import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0911Component } from './int0911.component';

describe('Int0911Component', () => {
  let component: Int0911Component;
  let fixture: ComponentFixture<Int0911Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0911Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0911Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
