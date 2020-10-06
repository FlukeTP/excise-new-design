import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ope0411Component } from './ope0411.component';

describe('Ope0411Component', () => {
  let component: Ope0411Component;
  let fixture: ComponentFixture<Ope0411Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ope0411Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ope0411Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
