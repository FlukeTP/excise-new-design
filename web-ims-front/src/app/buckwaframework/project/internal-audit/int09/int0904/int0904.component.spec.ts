import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0904Component } from './int0904.component';

describe('Int0904Component', () => {
  let component: Int0904Component;
  let fixture: ComponentFixture<Int0904Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0904Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0904Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
