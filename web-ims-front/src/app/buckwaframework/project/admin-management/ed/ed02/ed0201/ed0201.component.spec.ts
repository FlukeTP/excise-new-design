import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ed0201Component } from './ed0201.component';

describe('Ed0201Component', () => {
  let component: Ed0201Component;
  let fixture: ComponentFixture<Ed0201Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ed0201Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ed0201Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
