import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Se02Component } from './se02.component';

describe('Se02Component', () => {
  let component: Se02Component;
  let fixture: ComponentFixture<Se02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Se02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Se02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
