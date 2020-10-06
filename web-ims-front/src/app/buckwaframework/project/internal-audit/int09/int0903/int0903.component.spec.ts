import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0903Component } from './int0903.component';

describe('Int0903Component', () => {
  let component: Int0903Component;
  let fixture: ComponentFixture<Int0903Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0903Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0903Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
