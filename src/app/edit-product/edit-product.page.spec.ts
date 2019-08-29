import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductPage } from './edit-product.page';

describe('EditProductPage', () => {
  let component: EditProductPage;
  let fixture: ComponentFixture<EditProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
