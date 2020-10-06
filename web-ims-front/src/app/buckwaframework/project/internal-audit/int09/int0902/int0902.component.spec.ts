import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0902Component } from './int0902.component';

describe('Int0902Component', () => {
  let component: Int0902Component;
  let fixture: ComponentFixture<Int0902Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0902Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0902Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
