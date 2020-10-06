import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0906Component } from './int0906.component';

describe('Int0906Component', () => {
  let component: Int0906Component;
  let fixture: ComponentFixture<Int0906Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0906Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0906Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
