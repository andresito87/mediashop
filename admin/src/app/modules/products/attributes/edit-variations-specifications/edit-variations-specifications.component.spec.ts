import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVariationsSpecificationsComponent } from './edit-variations-specifications.component';

describe('EditVariationsSpecificationsComponent', () => {
  let component: EditVariationsSpecificationsComponent;
  let fixture: ComponentFixture<EditVariationsSpecificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditVariationsSpecificationsComponent]
    });
    fixture = TestBed.createComponent(EditVariationsSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
