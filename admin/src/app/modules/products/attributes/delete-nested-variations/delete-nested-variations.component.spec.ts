import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNestedVariationsComponent } from './delete-nested-variations.component';

describe('DeleteNestedVariationsComponent', () => {
  let component: DeleteNestedVariationsComponent;
  let fixture: ComponentFixture<DeleteNestedVariationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteNestedVariationsComponent]
    });
    fixture = TestBed.createComponent(DeleteNestedVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
