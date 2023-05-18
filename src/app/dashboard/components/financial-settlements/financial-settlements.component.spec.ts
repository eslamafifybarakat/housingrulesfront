import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialSettlementsComponent } from './financial-settlements.component';

describe('FinancialSettlementsComponent', () => {
  let component: FinancialSettlementsComponent;
  let fixture: ComponentFixture<FinancialSettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialSettlementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
