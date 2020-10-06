import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ope0410Component } from './ope0410.component';

describe('Ope0410Component', () => {
  let component: Ope0410Component;
  let fixture: ComponentFixture<Ope0410Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ope0410Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ope0410Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
