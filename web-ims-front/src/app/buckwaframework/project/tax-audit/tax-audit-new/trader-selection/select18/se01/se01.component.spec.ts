import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Se01Component } from './se01.component';

describe('Se01Component', () => {
  let component: Se01Component;
  let fixture: ComponentFixture<Se01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Se01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Se01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
