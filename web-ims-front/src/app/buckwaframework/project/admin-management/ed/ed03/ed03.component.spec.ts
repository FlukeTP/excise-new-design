import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ed03Component } from './ed03.component';

describe('Ed03Component', () => {
  let component: Ed03Component;
  let fixture: ComponentFixture<Ed03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ed03Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ed03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
