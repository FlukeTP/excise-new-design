import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ta03011001Component } from './ta03011001.component';

describe('Ta03011001Component', () => {
  let component: Ta03011001Component;
  let fixture: ComponentFixture<Ta03011001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ta03011001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ta03011001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
