import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ed0101Component } from './ed0101.component';

describe('Ed02Component', () => {
  let component: Ed0101Component;
  let fixture: ComponentFixture<Ed0101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ed0101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ed0101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
