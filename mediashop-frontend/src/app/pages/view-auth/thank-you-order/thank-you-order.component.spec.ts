import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouOrderComponent } from './thank-you-order.component';

describe('ThankYouOrderComponent', () => {
  let component: ThankYouOrderComponent;
  let fixture: ComponentFixture<ThankYouOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThankYouOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThankYouOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
