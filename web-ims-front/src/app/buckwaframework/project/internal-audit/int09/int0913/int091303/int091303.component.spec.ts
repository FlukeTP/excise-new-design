import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int091303Component } from './int091303.component';

describe('Int091303Component', () => {
  let component: Int091303Component;
  let fixture: ComponentFixture<Int091303Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int091303Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int091303Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
