import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVariationsSpecificationsComponent } from './delete-variations-specifications.component';

describe('DeleteVariationsSpecificationsComponent', () => {
  let component: DeleteVariationsSpecificationsComponent;
  let fixture: ComponentFixture<DeleteVariationsSpecificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteVariationsSpecificationsComponent]
    });
    fixture = TestBed.createComponent(DeleteVariationsSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
