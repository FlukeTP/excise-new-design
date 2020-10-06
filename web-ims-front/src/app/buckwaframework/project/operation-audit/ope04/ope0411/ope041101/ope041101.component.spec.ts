import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ope041101Component } from './ope041101.component';

describe('Ope041101Component', () => {
  let component: Ope041101Component;
  let fixture: ComponentFixture<Ope041101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ope041101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ope041101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
