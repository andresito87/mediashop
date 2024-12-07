import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersProfileClientComponent } from './orders-profile-client.component';

describe('OrdersProfileClientComponent', () => {
  let component: OrdersProfileClientComponent;
  let fixture: ComponentFixture<OrdersProfileClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersProfileClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersProfileClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
