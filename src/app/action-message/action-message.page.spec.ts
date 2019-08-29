import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMessagePage } from './action-message.page';

describe('ActionMessagePage', () => {
  let component: ActionMessagePage;
  let fixture: ComponentFixture<ActionMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionMessagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
