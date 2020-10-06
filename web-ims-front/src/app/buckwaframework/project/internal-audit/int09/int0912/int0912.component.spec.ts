import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0912Component } from './int0912.component';

describe('Int0912Component', () => {
  let component: Int0912Component;
  let fixture: ComponentFixture<Int0912Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0912Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0912Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
