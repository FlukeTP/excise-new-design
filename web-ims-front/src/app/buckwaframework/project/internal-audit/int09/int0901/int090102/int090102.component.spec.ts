import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int090102Component } from './int090102.component';

describe('Int090102Component', () => {
  let component: Int090102Component;
  let fixture: ComponentFixture<Int090102Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int090102Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int090102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
