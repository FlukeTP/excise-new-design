import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ed01Component } from './ed01.component';

describe('Ed01Component', () => {
  let component: Ed01Component;
  let fixture: ComponentFixture<Ed01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ed01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ed01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
