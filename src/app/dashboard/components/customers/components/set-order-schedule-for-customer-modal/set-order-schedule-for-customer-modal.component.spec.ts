import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetOrderScheduleForCustomerModalComponent } from './set-order-schedule-for-customer-modal.component';

describe('SetOrderScheduleForCustomerModalComponent', () => {
  let component: SetOrderScheduleForCustomerModalComponent;
  let fixture: ComponentFixture<SetOrderScheduleForCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetOrderScheduleForCustomerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetOrderScheduleForCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
