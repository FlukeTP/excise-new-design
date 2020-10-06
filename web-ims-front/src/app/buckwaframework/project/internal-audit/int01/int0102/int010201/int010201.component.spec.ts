import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int010201Component } from './int010201.component';

describe('Int010201Component', () => {
  let component: Int010201Component;
  let fixture: ComponentFixture<Int010201Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int010201Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int010201Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
