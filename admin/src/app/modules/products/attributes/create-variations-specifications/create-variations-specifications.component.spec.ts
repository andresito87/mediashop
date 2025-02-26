import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVariationsSpecificationsComponent } from './create-variations-specifications.component';

describe('CreateVariationsSpecificationsComponent', () => {
  let component: CreateVariationsSpecificationsComponent;
  let fixture: ComponentFixture<CreateVariationsSpecificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateVariationsSpecificationsComponent]
    });
    fixture = TestBed.createComponent(CreateVariationsSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
