import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ed02Component } from './ed02.component';

describe('Ed02Component', () => {
  let component: Ed02Component;
  let fixture: ComponentFixture<Ed02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ed02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ed02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
