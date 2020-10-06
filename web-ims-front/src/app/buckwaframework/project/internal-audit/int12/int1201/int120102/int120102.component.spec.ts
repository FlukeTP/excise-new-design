import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int120102Component } from './int120102.component';

describe('Int120102Component', () => {
  let component: Int120102Component;
  let fixture: ComponentFixture<Int120102Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int120102Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int120102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
