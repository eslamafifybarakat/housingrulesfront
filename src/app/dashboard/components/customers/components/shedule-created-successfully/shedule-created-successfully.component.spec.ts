import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheduleCreatedSuccessfullyComponent } from './shedule-created-successfully.component';

describe('SheduleCreatedSuccessfullyComponent', () => {
  let component: SheduleCreatedSuccessfullyComponent;
  let fixture: ComponentFixture<SheduleCreatedSuccessfullyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheduleCreatedSuccessfullyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheduleCreatedSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
