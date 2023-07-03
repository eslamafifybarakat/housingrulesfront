import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSheduleComponent } from './order-shedule.component';

describe('OrderSheduleComponent', () => {
  let component: OrderSheduleComponent;
  let fixture: ComponentFixture<OrderSheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
