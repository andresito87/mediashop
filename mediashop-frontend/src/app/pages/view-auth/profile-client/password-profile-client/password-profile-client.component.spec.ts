import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordProfileClientComponent } from './password-profile-client.component';

describe('PasswordProfileClientComponent', () => {
  let component: PasswordProfileClientComponent;
  let fixture: ComponentFixture<PasswordProfileClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordProfileClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordProfileClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
