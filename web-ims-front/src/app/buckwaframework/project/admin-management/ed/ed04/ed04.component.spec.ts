import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ed04Component } from './ed04.component';

describe('Ed04Component', () => {
  let component: Ed04Component;
  let fixture: ComponentFixture<Ed04Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ed04Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ed04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
