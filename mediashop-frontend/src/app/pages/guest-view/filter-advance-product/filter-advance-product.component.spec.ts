import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAdvanceProductComponent } from './filter-advance-product.component';

describe('FilterAdvanceProductComponent', () => {
  let component: FilterAdvanceProductComponent;
  let fixture: ComponentFixture<FilterAdvanceProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterAdvanceProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterAdvanceProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
