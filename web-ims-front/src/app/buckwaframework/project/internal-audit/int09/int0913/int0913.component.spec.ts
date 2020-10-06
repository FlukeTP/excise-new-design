import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0913Component } from './int0913.component';

describe('Int0913Component', () => {
  let component: Int0913Component;
  let fixture: ComponentFixture<Int0913Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0913Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0913Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
