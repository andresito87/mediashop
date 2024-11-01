import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNestedVariationsComponent } from './create-nested-variations.component';

describe('CreateNestedVariationsComponent', () => {
  let component: CreateNestedVariationsComponent;
  let fixture: ComponentFixture<CreateNestedVariationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNestedVariationsComponent]
    });
    fixture = TestBed.createComponent(CreateNestedVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
