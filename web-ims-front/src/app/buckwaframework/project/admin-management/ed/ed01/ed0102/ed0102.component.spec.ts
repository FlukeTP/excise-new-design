import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ed0102Component } from './ed0102.component';

describe('Ed0102Component', () => {
  let component: Ed0102Component;
  let fixture: ComponentFixture<Ed0102Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ed0102Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ed0102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
