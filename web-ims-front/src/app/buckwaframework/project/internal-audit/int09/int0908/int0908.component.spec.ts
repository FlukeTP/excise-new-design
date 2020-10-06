import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0908Component } from './int0908.component';

describe('Int0908Component', () => {
  let component: Int0908Component;
  let fixture: ComponentFixture<Int0908Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0908Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0908Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
