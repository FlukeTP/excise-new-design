import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ope040602Component } from './ope040602.component';

describe('Ope040602Component', () => {
  let component: Ope040602Component;
  let fixture: ComponentFixture<Ope040602Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ope040602Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ope040602Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
