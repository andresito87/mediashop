import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressProfileClientComponent } from './address-profile-client.component';

describe('AddressProfileClientComponent', () => {
  let component: AddressProfileClientComponent;
  let fixture: ComponentFixture<AddressProfileClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressProfileClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressProfileClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
