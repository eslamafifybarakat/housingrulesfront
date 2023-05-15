import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCompleteOrderComponent } from './confirm-complete-order.component';

describe('ConfirmCompleteOrderComponent', () => {
  let component: ConfirmCompleteOrderComponent;
  let fixture: ComponentFixture<ConfirmCompleteOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmCompleteOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCompleteOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
