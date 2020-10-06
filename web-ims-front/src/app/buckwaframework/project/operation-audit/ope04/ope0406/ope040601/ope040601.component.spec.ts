import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ope040601Component } from './ope040601.component';

describe('Ope040601Component', () => {
  let component: Ope040601Component;
  let fixture: ComponentFixture<Ope040601Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ope040601Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ope040601Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
