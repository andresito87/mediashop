import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNestedVariationsComponent } from './edit-nested-variations.component';

describe('EditNestedVariationsComponent', () => {
  let component: EditNestedVariationsComponent;
  let fixture: ComponentFixture<EditNestedVariationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditNestedVariationsComponent]
    });
    fixture = TestBed.createComponent(EditNestedVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
