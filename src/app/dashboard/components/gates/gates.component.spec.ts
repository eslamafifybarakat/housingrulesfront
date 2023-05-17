import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementesComponent } from './settlementes.component';

describe('SettlementesComponent', () => {
  let component: SettlementesComponent;
  let fixture: ComponentFixture<SettlementesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettlementesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
